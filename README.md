# 🚀 AdaptivQ 🎯  
**AI-Powered Adaptive Mock Interview Platform**

AdaptivQ is an intelligent, adaptive mock interview and quiz platform powered by Gen AI. It dynamically personalizes questions and feedback in real-time using machine learning and Retrieval-Augmented Generation (RAG), making it a smart tool for students, educators, and ed-tech platforms looking to boost learning outcomes through AI.

---

## ✨ Features

- 🎯 **Adaptive Questioning** – Dynamically adjusts question difficulty based on user performance and confidence levels.
- 🧠 **Knowledge Profiling** – Tracks accuracy, hesitation time, and self-rated confidence to build a real-time skill map.
- 📈 **Performance Analytics** – Visual dashboards show trends, improvements, and weak zones for continuous growth.
- 🔁 **Spaced Repetition System** – Automatically reintroduces previously incorrect or hesitant questions using SRS techniques.
- 🤖 **Gen AI Integration** – Uses Gemini API for real-time question generation, contextual explanations, and answer evaluations.
- 🧾 **RAG Sheets** – Integrated Retrieval-Augmented Generation using custom knowledge bases and sheets to personalize question flow.
- 🌐 **Web Scraping** – Selenium and BeautifulSoup power live content enrichment and dynamic question generation from verified sources.
- 🎮 **Gamified Experience (Upcoming)** – Badges, leaderboards, and adaptive timers to increase engagement and challenge.

---

## 🧩 Architecture Overview

- **Client Layer**: React.js + Material UI for responsive UI
- **Application Layer**: Node.js + Express.js as the API gateway
- **ML/AI Layer**:
  - Python + TensorFlow/PyTorch for model training and real-time predictions
  - Google Gemini API for question generation, scoring, and explanation
  - RAG architecture for enhanced contextual responses
- **Scraping & Enrichment**:
  - **Selenium** and **BeautifulSoup** for dynamic web scraping
  - **Firecrawl** for intelligent crawling and content enrichment
- **Background Processing**: Celery workers handle async tasks (model training, analytics sync, content fetch)
- **Evaluation Engine**: Gen AI-backed feedback using Gemini models based on student inputs and answer quality

---

## 🛠️ Tech Stack

| Layer             | Tools Used                                                                 |
|------------------|------------------------------------------------------------------------------|
| **Frontend**      | React, TypeScript, Tailwind CSS, Vite                                       |
| **Backend**       | Node.js, Express.js, RESTful APIs                                           |
| **ML & AI**       | Python, TensorFlow, PyTorch, Google Gemini API, Firecrawl, RAG, Gen AI     |
| **Scraping**      | Selenium, BeautifulSoup, Playwright                                         |
| **Database**      | PostgreSQL, Redis, Firebase (Auth & Storage), Flask                         |
| **Infrastructure**| Docker, Vercel (Hosting), GitHub Actions (CI/CD), RAG knowledge base sheets |

---

## 💡 What's Next?

- 🧠 GPT-4 and Gemini Pro hybrid AI mode for richer adaptive logic  
- 🎯 Deeper integration with external LMS platforms  
- 📚 Smart content recommendation based on user strengths  
- 🧪 A/B testing and experiment dashboard for AI evaluations  

---


