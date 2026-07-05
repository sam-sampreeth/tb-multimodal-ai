# NexTB: Tuberculosis Detection System

NexTB is a Tuberculosis detection system. It features a Python/FastAPI backend for processing X-rays utilizing machine learning, and a React/Vite frontend dashboard for medical professionals to review inferences, case histories, and detailed probability overlays.

## Project Structure

- **`backend/`**: Contains the FastAPI server, SQLite database handlers, and inference logic.
- **`frontend/`**: Contains the React and Vite single page application (SPA).
- **`tb_system/`**: Core machine learning models, attention map generation (GradCAM++), and PDF report builders.

## Dataset
 Dataset sources:

- **VinDR-CXR:** https://physionet.org/content/vindr-cxr/1.0.0/
- **Montgomery County CXR Set:** https://data.lhncbc.nlm.nih.gov/public/Tuberculosis-Chest-X-ray-Datasets/Montgomery-County-CXR-Set/MontgomerySet/
- **Shenzhen Hospital CXR Set:** https://data.lhncbc.nlm.nih.gov/public/Tuberculosis-Chest-X-ray-Datasets/Shenzhen-Hospital-CXR-Set/
- **TBX11K Dataset:** https://www.kaggle.com/datasets/usmanshams/tbx-11
- **Delhi A/B (Mendeley):** https://data.mendeley.com/datasets/8j2g3csprk/2

---

## Installation and Setup

If you have just cloned this repository, you will need to set up both the Backend API and the Frontend Web App.


### 1. Backend Setup (Python)

The backend handles the inference and data storage. You will need Python 3.9 or higher installed.

1. Open a terminal and navigate to the project root:
   ```bash
   cd tb-multimodal-ai
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The backend API will run at `http://localhost:8000/api/v1`.

### 2. Frontend Setup (Node.js/React)

The frontend provides the interactive user interface. You will need Node.js installed (which includes npm).

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd tb-multimodal-ai/frontend
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will run at `http://localhost:5173`. Open this URL in your browser to view the dashboard.

---

## Building for Production

If you wish to deploy the system to a production environment:

**Frontend build:**
```bash
cd frontend
npm run build
```
This will compile the React assets into the `frontend/dist/` directory, which can be served statically by engines like Nginx, Vercel, or mounted directly to the FastAPI server.

