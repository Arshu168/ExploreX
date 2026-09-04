# 📘 Complete Local Backend Setup Guide for Non-Programmers

This guide will walk you through running the **ExploreX AI Backend** on your local computer using **FastAPI**, **Supabase PostgreSQL**, **ChromaDB**, and **LLaMA (Ollama)**.

You don't need any prior coding knowledge! Just follow these 4 simple steps.

---

## 📋 Prerequisites
1. **Python 3.10 or higher**: Download from [python.org](https://www.python.org/downloads/) (Make sure to check *"Add Python to PATH"* during installation).
2. **Ollama**: Download from [ollama.com](https://ollama.com).

---

## 🚀 Step-by-Step Instructions

### Step 1: Install & Start LLaMA 3.2
1. Install Ollama from [ollama.com](https://ollama.com).
2. Open your terminal (macOS/Linux) or Command Prompt / PowerShell (Windows).
3. Type the following command and press Enter:
   ```bash
   ollama pull llama3.2
   ```
4. Keep Ollama running in the background.

---

### Step 2: Configure Supabase PostgreSQL (Optional)
If you want cloud database persistence with Supabase:
1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project.
3. Go to **Project Settings -> API** and copy:
   - Project URL (`SUPABASE_URL`)
   - anon/public key (`SUPABASE_KEY`)
4. In the `backend` folder, rename `.env.example` to `.env` and paste your keys.
*(If you skip this step, the app will run seamlessly in local offline mode!)*

---

### Step 3: Launch the Local FastAPI Server
1. Download or export your ExploreX AI project folder to your local computer.
2. Navigate into the `backend` folder.
3. **Run the startup script:**
   - **Windows**: Double click `run.bat`
   - **Mac/Linux**: Open Terminal in the `backend` folder and run:
     ```bash
     chmod +x run.sh
     ./run.sh
     ```
4. You will see green text saying: `⚡ Launching FastAPI Server on http://localhost:8000...`

---

### Step 4: Open Interactive API Documentation
Open your web browser and go to:
👉 **http://localhost:8000/docs**

You will see the live interactive Swagger UI where you can test all 20+ API endpoints (RAG vector search, LLaMA chat, trip generation, Supabase queries)!

---

## 📁 Backend Directory Structure
```
backend/
├── main.py              # FastAPI main server entry point
├── database.py          # Supabase PostgreSQL client & local fallback
├── rag_service.py       # ChromaDB vector store + Ollama LLaMA RAG engine
├── requirements.txt     # Python dependencies list
├── .env.example         # Environment variables template
├── run.sh               # One-click startup script for Mac/Linux
├── run.bat              # One-click startup script for Windows
└── routers/             # API Module Routers
    ├── ai_planner.py    # LLaMA itinerary generator
    ├── rag.py           # ChromaDB vector store operations
    ├── places.py        # Supabase locations query
    ├── trips.py         # Itinerary CRUD operations
    └── budget.py        # Destination budget analytics
```
