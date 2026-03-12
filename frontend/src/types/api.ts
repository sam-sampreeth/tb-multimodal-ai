export interface PatientIn {
  patient_id: string;
  age: number;
  gender: string;
  district?: string;
  occupation?: string;
  cough_present?: boolean;
  fever?: boolean;
  night_sweats?: boolean;
  weight_loss?: boolean;
  hiv_status?: string;
  diabetes?: boolean;
  alcoholism?: boolean;
  immunosuppressed?: boolean;
  previous_tb?: string;
  tb_contact?: boolean;
  comorbidities?: string; // Adding for UI flexibility
  symptom_duration?: number;
}

export interface TBDetection {
  probability: number;
  zone: string;
  zone_color: string;
  threshold_used: number;
  calibrated: boolean;
}

export interface DrugResistance {
  prediction: string;
  probabilities: Record<string, number>;
  is_demo_mode: boolean;
  demo_warning?: string;
}

export interface ClinicalRisk {
  band: string;
  band_color: string;
  score: number;
  factors: string[];
}

export interface Heatmap {
  original_base64: string;
  heatmap_only_base64: string;
  overlay_base64: string;
}

export interface ModelMeta {
  model_version: string;
  auc: number;
  threshold: number;
  device: string;
}

export interface PredictResponse {
  case_id: string;
  patient_id: string;
  timestamp: string;
  patient: PatientIn;
  tb_detection: TBDetection;
  drug_resistance: DrugResistance;
  clinical_risk: ClinicalRisk;
  finding_text: string;
  recommendations: string[];
  heatmap: Heatmap;
  model_meta: ModelMeta;
  warnings: string[];
}

export interface CaseSummary {
  case_id: string;
  patient_id: string;
  timestamp: string;
  tb_zone: string;
  tb_probability: number;
  dr_prediction: string;
  risk_band: string;
  district: string;
  age: number;
}

export interface CaseListResponse {
  cases: CaseSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface DistrictStat {
  district: string;
  total: number;
  tb_detected: number;
  rate: number;
}

export interface WeeklyStat {
  week: string;
  total: number;
  tb_detected: number;
}

export interface DashboardStats {
  total_cases: number;
  tb_detected: number;
  detection_rate: number;
  avg_probability: number;
  by_district: DistrictStat[];
  by_week: WeeklyStat[];
  dr_breakdown: Record<string, number>;
  gender_breakdown: Record<string, number>;
  risk_breakdown: Record<string, number>;
  zone_breakdown: Record<string, number>;
  age_distribution: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  threshold: number;
  device: string;
  model_auc: number;
  model_version: string;
}
