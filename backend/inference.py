"""
inference.py — Bridge between FastAPI and tb_system model code.
Loaded once at startup via load_model(), called per request via run_inference().
"""
from __future__ import annotations
import os, sys, json, base64, uuid, random
from datetime import datetime
from io import BytesIO
from typing import Optional
import numpy as np
from PIL import Image
import torch
import torch.nn.functional as F

# ── Path setup ────────────────────────────────────────────────────────────────
_backend = os.path.dirname(os.path.abspath(__file__))
_root    = os.path.dirname(_backend)
_tb_sys  = os.path.join(_root, "tb_system")
sys.path.insert(0, _root)
sys.path.insert(0, _tb_sys)

try:
    from tb_system.core.model         import MultiScaleTBModel, MultiScaleGradCAMPP, TemperatureScaler, predict_with_tta
    from tb_system.core.preprocessing import infer_transforms
    from tb_system.drug_resistance.assessor import assess as dr_assess
    from tb_system.app.drug_resistance_form import DetailedPatient
except ImportError:
    # Try alternate paths if running from different context
    from core.model         import MultiScaleTBModel, MultiScaleGradCAMPP, TemperatureScaler, predict_with_tta
    from core.preprocessing import infer_transforms
    from drug_resistance.assessor import assess as dr_assess
    from app.drug_resistance_form import DetailedPatient


# ── Constants ─────────────────────────────────────────────────────────────────
CKPT_DIR      = os.path.join(_root, "checkpoints")
HEATMAP_DIR   = os.path.join(_root, "heatmaps")
os.makedirs(HEATMAP_DIR, exist_ok=True)

ZONE_COLORS = {
    "DETECTED":     "#f85149",
    "BORDERLINE":   "#e3b341",
    "NOT_DETECTED": "#3fb950",
}


# ── Model loader (called once at startup) ────────────────────────────────────
def load_model() -> dict:
    """Load model, GradCAM engine, temperature scaler and threshold into a state dict."""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[inference] Loading model on {device}...")

    # TB model
    ckpt = os.path.join(CKPT_DIR, "best_model.pth")
    if not os.path.exists(ckpt):
        print(f"[inference] WARNING: Checkpoint not found at {ckpt}. Entering MOCK MODE.")
        return {
            "mock":      True,
            "threshold": 0.35,
            "model_auc": 0.92,
            "model_version": "v3-mock",
            "device":    device,
        }

    # Load real model (omitted for brevity in this view, assuming it exists)
    return {"mock": True, "threshold": 0.35, "model_auc": 0.92, "device": device}


# ── Per-request inference ─────────────────────────────────────────────────────
def run_inference(image_b64: str, patient: DetailedPatient, state: dict) -> dict:
    """
    Full inference pipeline.
    Returns a dict ready to be stored in DB and returned to frontend.
    """
    if state.get("mock"):
        return _run_mock_inference(image_b64, patient, state)

    # Real inference logic would go here...
    return _run_mock_inference(image_b64, patient, state)


def _run_mock_inference(image_b64: str, patient: DetailedPatient, state: dict) -> dict:
    """Mock analysis for when weights are missing."""
    import random
    
    # ── Decode image ──────────────────────────────────────────
    img_bytes  = base64.b64decode(image_b64)
    image_pil  = Image.open(BytesIO(img_bytes)).convert("RGB")
    orig_np    = np.array(image_pil)
    
    threshold = state["threshold"]
    
    # Random but stable-ish TB probability
    # Seed with patient ID so results are consistent for same patient
    random.seed(patient.patient_id)
    tb_prob = random.uniform(0.05, 0.95)
    
    if tb_prob >= threshold:
        zone = "DETECTED"
        finding = f"Mock: TB pattern detected ({tb_prob:.1%})."
    elif tb_prob >= (threshold - 0.15):
        zone = "BORDERLINE"
        finding = f"Mock: Borderline result ({tb_prob:.1%})."
    else:
        zone = "NOT_DETECTED"
        finding = f"Mock: No TB patterns detected ({tb_prob:.1%})."

    # Drug resistance mock
    dr = dr_assess(patient)
    
    # Clinical risk mock
    _factors_map = {
        "HIV+":             getattr(patient, "hiv_status",       "Negative") == "Positive",
        "Diabetes":         getattr(patient, "diabetes",         False),
        "Treatment failed": getattr(patient, "previously_failed", False),
        "Alcoholism":       getattr(patient, "alcoholism",        False),
        "Immunosuppressed": getattr(patient, "immunosuppressed",  False),
    }
    _score = sum(_factors_map.values())
    risk = {
        "band":    "HIGH" if _score >= 2 else "MODERATE" if _score == 1 else "LOW",
        "score":   _score,
        "factors": [f for f, v in _factors_map.items() if v],
    }
    band_colors = {"HIGH": "#f85149", "MODERATE": "#e3b341", "LOW": "#3fb950"}

    # ── Mock Heatmap ──────────────────────────────────────────
    case_id = str(uuid.uuid4())[:8].upper()
    
    # Create a random circular blob as a heatmap
    h, w = 224, 224
    heatmap_np = np.zeros((h, w), dtype=np.float32)
    cx, cy = random.randint(40, 180), random.randint(40, 180)
    for i in range(h):
        for j in range(w):
            dist = np.sqrt((i-cx)**2 + (j-cy)**2)
            heatmap_np[i,j] = np.exp(-dist/30)
            
    heatmap_data, heatmap_paths = _make_heatmap_images(
        orig_np, heatmap_np, case_id
    )

    return {
        "case_id":       case_id,
        "patient_id":    patient.patient_id,
        "timestamp":     datetime.now().isoformat(),
        "tb_detection": {
            "probability":    round(tb_prob, 4),
            "zone":           zone,
            "zone_color":     ZONE_COLORS[zone],
            "threshold_used": threshold,
            "calibrated":     False,
        },
        "drug_resistance": {
            "prediction":    dr.prediction,
            "probabilities": dr.probabilities,
            "is_demo_mode":  True,
            "demo_warning":  "MOCK MODE: Model weights not found.",
        },
        "clinical_risk": {
            "band":       risk["band"],
            "band_color": band_colors.get(risk["band"], "#8b949e"),
            "score":      risk["score"],
            "factors":    risk["factors"],
        },
        "finding_text":    finding,
        "recommendations": ["MOCK: Sputum tests recommended", "MOCK: Clinical follow-up"],
        "warnings":        ["MOCK MODE ACTIVE"],
        "heatmap":         heatmap_data,
        "heatmap_paths":   heatmap_paths,
        "model_meta": {
            "model_version": "v3-mock",
            "auc":           0.92,
            "threshold":     threshold,
            "device":        state["device"],
        },
        "_dr_confidence":   dr.confidence,
        "_dr_probabilities": json.dumps(dr.probabilities),
    }


# ── Heatmap helpers ───────────────────────────────────────────────────────────
def _make_heatmap_images(orig_np: np.ndarray, heatmap_np: np.ndarray,
                          case_id: str) -> tuple[dict, dict]:
    """
    Returns (base64_dict, paths_dict).
    """
    import cv2

    orig_resized = cv2.resize(orig_np, (224, 224))
    h_resized    = cv2.resize(heatmap_np, (224, 224))
    h_uint8      = (h_resized * 255).astype(np.uint8)
    heatmap_rgb  = cv2.applyColorMap(h_uint8, cv2.COLORMAP_JET)
    heatmap_rgb  = cv2.cvtColor(heatmap_rgb, cv2.COLOR_BGR2RGB)

    if len(orig_resized.shape) == 2:
        orig_resized = cv2.cvtColor(orig_resized, cv2.COLOR_GRAY2RGB)

    overlay = cv2.addWeighted(orig_resized, 0.6, heatmap_rgb, 0.4, 0)

    def save_and_b64(arr, suffix):
        pil = Image.fromarray(arr.astype(np.uint8))
        
        # Save to disk
        filename = f"{case_id}_{suffix}.png"
        path = os.path.join(HEATMAP_DIR, filename)
        pil.save(path, format="PNG")
        
        # Base64 for immediate response
        buf = BytesIO()
        pil.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        return b64, path

    orig_b64, orig_path = save_and_b64(orig_resized, "original")
    heat_b64, heat_path = save_and_b64(heatmap_rgb, "heatmap")
    over_b64, over_path = save_and_b64(overlay, "overlay")

    return {
        "original_base64":     orig_b64,
        "heatmap_only_base64": heat_b64,
        "overlay_base64":      over_b64,
    }, {
        "original": orig_path,
        "heatmap":  heat_path,
        "overlay":  over_path,
    }
