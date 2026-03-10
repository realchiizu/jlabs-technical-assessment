# 🌐 IP Tracker & Geolocation Dashboard
**Developed by:** Janriz Cuevas (FEU Institute of Technology)
**Purpose:** Basic Assessment Exam for JLabs

A full-stack application featuring a secure login system, real-time IP geolocation, interactive mapping, and a persistent search history manager.

---

## 🔗 Live Demo
- **Interactive Dashboard:** [https://jlabs-technical-assessment.vercel.app/]
*(Note: Backend is hosted as a private Vercel Serverless service)*

---

## 🔑 Test Credentials
Use these to access the dashboard:
- **Email:** `test@example.com`
- **Password:** `password123`

---

## 🚀 Local Setup Instructions

### 1. Clone the repository
```bash
git clone [https://github.com/janriz-cuevas/jlabs-technical-assessment.git](https://github.com/janriz-cuevas/jlabs-technical-assessment.git)
cd jlabs-technical-assessment

```

### 2. Setup the Backend (API)

```bash
cd api-repo
npm install
node server.js

```

### 3. Setup the Frontend (Web)

```bash
cd web-repo
npm install
npm start

```

## 📂 Project Structure

* `api-repo/`: Node.js/Express backend handling authentication and search history logic.
* `web-repo/`: React.js frontend containing the UI, Map components, and API integration.
* `vercel.json`: Configuration for seamless Serverless deployment.

