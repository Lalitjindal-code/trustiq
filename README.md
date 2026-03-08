<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="120" alt="Trustiq Logo">
  
  <h1>Trustiq: Intelligent Data Guardian</h1>
  
  <p>
    <strong>Automated safety layer for GenAI pipelines. Prevent biased decisions, detect data anomalies, and simulate edge cases before your models hit production.</strong>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#installation">Installation</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

<hr>

## ✨ Highlights

Trustiq evaluates datasets recursively, finding errors before they infect your AI models. It acts as an enterprise quality layer, ensuring that your AI is safe, fair, and reliable.

- 🔍 **Automated Auditing**: Instantly identify missing values, duplicates, and outliers with our real-time processing engine.
- ⚖️ **Bias & Fairness Testing**: Detect demographic bias to ensure equal opportunity and demographic parity across all categories (powered by Fairlearn).
- 🧠 **GenAI Simulation**: Spin up LLM agents to simulate millions of edge cases and adversarial attacks on your dataset.
- 📊 **Explainable AI**: Translate complex metrics into human-readable assessments using Langchain and Gemini/Ollama.

---

## 🏗️ Architecture

Trustiq is built on a modern, robust, and scalable tech stack:

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS & Framer Motion for smooth animations
- **3D Graphics**: React Three Fiber / Drei for immersive visualizations
- **Auth**: Firebase Authentication

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Data Processing**: Pandas, NumPy, Scikit-Learn
- **Fairness & Bias**: Fairlearn & AIF360
- **AI/LLM Ops**: LangChain, ChromaDB (Vector DB)
- **LLM Engine**: Ollama (local/deployed) and Google Gemini (fallback API)

### AI Models (Hugging Face)
- **Hosted LLM**: Ollama server mapped to Hugging Face Spaces port (`7860`).
- **Default Model**: `llama3.1:latest`

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Ollama (installed locally if not using Hugging Face Space)

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
> The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 🌍 Deployment Guide

Trustiq is designed to be easily deployed across Vercel, Render, and Hugging Face.

### 1. Backend (Deploy to Render)
The repository includes a `render.yaml` file for seamless deployment.

1. Create a new Web Service on [Render](https://render.com/).
2. Point it to your repository.
3. Configure the following Environment Variables in the Render dashboard:
   - `OLLAMA_BASE_URL`: The URL of your deployed Hugging Face space (e.g., `https://your-space.hf.space`).
   - `GOOGLE_API_KEY`: (Optional) Your Google Gemini API key if you wish to use it instead of Ollama.
   - `PERSIST_DIRECTORY`: `/etc/secrets/chroma_db` (pre-configured in `render.yaml`).

### 2. AI Model (Deploy to Hugging Face Spaces)
Deploying the Ollama model is necessary for the AI Simulation and RAG components if not using Gemini.

1. Create a new **Docker Space** on [Hugging Face](https://huggingface.co/spaces).
2. Push the contents of the `huggingface/` directory to the space.
3. The Space will automatically build and expose port `7860`.

### 3. Frontend (Deploy to Vercel)
1. Import your repository into [Vercel](https://vercel.com).
2. Set the **Framework Preset** to Next.js.
3. Add the following Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render backend URL (e.g., `https://trustiq-backend.onrender.com/api`).
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Extracted from `firebase.ts`.
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

---

<div align="center">
  <p>Built with ❤️ for a safer, fairer AI future.</p>
</div>
