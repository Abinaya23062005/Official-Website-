<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=e8c547&height=200&section=header&text=Abinaya&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=Developer%20·%20Educator%20·%20Creator&descAlignY=58&descSize=22&animation=fadeIn" width="100%"/>

# 🌐 Personal Portfolio & Services Website

[![Live Site](https://img.shields.io/badge/🚀%20Live%20Site-official--website--boe6.onrender.com-e8c547?style=for-the-badge&logoColor=black)](https://official-website-boe6.onrender.com/)
[![Admin Panel](https://img.shields.io/badge/🔧%20Admin%20Panel-Secure%20Dashboard-f07843?style=for-the-badge)](https://official-website-boe6.onrender.com/admin)
[![GitHub](https://img.shields.io/badge/GitHub-Abinaya23062005-181717?style=for-the-badge&logo=github)](https://github.com/Abinaya23062005)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Abinaya%20D-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/abinaya-d-03a830278/)

</div>

---

<div align="center">

### 🔗 [https://official-website-boe6.onrender.com](https://official-website-boe6.onrender.com/)

*Full Stack Developer · DSA Educator · AI Integrator · Freelancer — Chennai, Tamil Nadu 🇮🇳*

</div>

---

## ✨ What This Website Does

A complete **full-stack personal portfolio and services website** built from scratch. Clients can browse services, view projects, and submit applications directly — all stored in a secure database and sent to my email instantly.

---

## 🎨 Visual Effects & UI

| Feature | Description |
|---|---|
| 🌌 **Animated Mesh Gradient** | 6 colour blobs slowly drift and blend across the entire background |
| 🔵 **AI Network Nodes** | 70 interactive nodes connected by lines — repel away from mouse in real time |
| 🌈 **Rainbow Laser Cursor** | Custom cursor with glowing dot, smooth ring, and crosshair lines |
| 💥 **Click Ripple Burst** | Colorful particle + ring explosion on every click |
| ✍️ **Typing Animation** | Hero cycles through: Builds → Teaches → Creates → Solves → Codes |
| 📊 **Animated Counters** | Numbers count up from 0 on scroll into view |
| 🌗 **Dark / Light Theme** | Toggle between themes — preference saved to localStorage |
| 📜 **Scroll Progress Bar** | Rainbow gradient line fills across the top as you scroll |
| 🔄 **Scroll Reveal** | Sections fade and slide in as you scroll |

---

## 🛠️ Tech Stack

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)
![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

## 📁 Project Structure

```
portfolio/
├── 📄 server.js              ← Express server (security, routing, CSP)
├── 🗄️  db.js                 ← SQLite database with sql.js (pure JS)
├── 📦 package.json
├── 🔒 .env.example           ← Environment variables template
│
├── routes/
│   ├── 📡 api.js             ← POST /api/apply + email notifications
│   └── 🔧 admin.js           ← Admin dashboard (auth + live polling)
│
└── public/
    └── 🌐 index.html         ← Complete frontend (1300+ lines)
        ├── Mesh gradient canvas
        ├── AI network nodes canvas
        ├── Rainbow cursor + click effects
        ├── Hero, About, Services, Projects
        ├── Skills, Testimonials, FAQ
        └── Apply form + Footer
```

---

## 🚀 Features

### 🌐 Frontend
- **7 sections** — Hero, About, Services (6), Projects (6), Skills, Testimonials, FAQ, Apply
- **Sidebar navigation** with hover expand — collapses to icons, expands to labels
- **Hamburger menu** for mobile with full-screen overlay
- **Floating Apply button** on mobile for quick access
- **Back to top button** appears after scrolling 400px
- **Form auto-save** — fills back in after accidental page refresh (localStorage)
- **Social share buttons** — WhatsApp, LinkedIn, Twitter in footer
- **OG meta tags** — proper card preview when link is shared on WhatsApp/LinkedIn
- **Font preconnect** for faster Google Fonts loading

### ⚙️ Backend
- **SQLite database** (sql.js — pure JavaScript, no build tools needed)
- **Email notification** to owner when someone applies (Gmail + Nodemailer)
- **Auto-reply email** sent to applicant confirming their submission
- **Rate limiting** — max 5 form submissions per IP per 15 minutes
- **Input validation** on all form fields (express-validator)
- **Security headers** via Helmet (CSP, XSS, clickjacking protection)
- **Sitemap.xml** and **robots.txt** for Google indexing

### 🔧 Admin Dashboard (`/admin`)
- **Password protected** with Basic Auth (timing-safe comparison)
- **Live polling** — checks for new applications every 5 seconds
- **Sound + flash alert** when someone submits a form (no tab needed to refresh)
- **↗ Reply button** — opens Gmail compose pre-filled with applicant's email
- **⬇ Export CSV** — download all applications or messages as Excel-ready file
- **Status management** — New → Read → Replied → Closed
- **Delete records** with confirmation

---

## 🧩 Services Offered

| # | Service | Description |
|---|---|---|
| 01 | 🌐 Website Development | Custom responsive full-stack websites |
| 02 | 💼 Portfolio & Resume | Stunning portfolios + recruiter-ready resumes |
| 03 | 🧠 DSA Classes | Placement-focused Data Structures & Algorithms |
| 04 | 💻 Programming Classes | Python, JavaScript, SQL from scratch |
| 05 | 🤖 AI Integration | OpenAI, Gemini, Groq APIs in your app |
| 06 | 🎨 Frontend UI Design | Pixel-perfect animated interfaces |

---

## 🏆 About Me

```javascript
const abinaya = {
  role:       "Full Stack Developer · DSA Educator · AI Integrator",
  location:   "Chennai, Tamil Nadu 🇮🇳",
  education:  "B.E. CSE, AVS College of Technology (2025) — CGPA 8.5",
  experience: "Software Developer Intern @ Melvine Solution",
  skills:     ["HTML/CSS", "JavaScript", "Python", "React", "Node.js",
               "SQL", "MongoDB", "OpenAI API", "Gemini API", "DSA", "Java"],
  leetcode:   "200+ problems solved in Java",
  teaching:   "DSA & Programming to school and college students",
  target:     "Full-time SDE role | 4–6 LPA",
};
```

---

## ⚡ Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Abinaya23062005/abinaya-portfolio.git
cd abinaya-portfolio

# 2. Install dependencies (no build tools needed!)
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and fill in your Gmail App Password

# 4. Start the server
npm start

# 5. Open in browser
# Website → http://localhost:3000
# Admin   → http://localhost:3000/admin
```

---

## 🔐 Environment Variables

Create a `.env` file from `.env.example`:

```env
PORT=3000
NODE_ENV=production



```

---

## 📬 Contact

<div align="center">

| Platform | Link |
|---|---|
| 🌐 **Live Website** | [official-website-boe6.onrender.com](https://official-website-boe6.onrender.com/) |
| 🔗 **LinkedIn** | [linkedin.com/in/abinaya-d-03a830278](https://www.linkedin.com/in/abinaya-d-03a830278/) |
| 🐙 **GitHub** | [github.com/Abinaya23062005](https://github.com/Abinaya23062005) |

</div>

---

## 📊 GitHub Stats

<div align="center">
<img width="1917" height="970" alt="image" src="https://github.com/user-attachments/assets/05303c8f-307b-473d-ac22-20abcbde0e20" />
<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/6f217bea-0809-4cc5-a940-037e54d30e5e" />
<img width="1905" height="907" alt="image" src="https://github.com/user-attachments/assets/7b33f0c9-16f7-4c85-bbe0-fae7e7e57424" />


![Abinaya's GitHub Stats](https://github-readme-stats.vercel.app/api?username=Abinaya23062005&show_icons=true&theme=dark&title_color=e8c547&icon_color=e8c547&text_color=eef2f6&bg_color=0e1318&border_color=e8c547&hide_border=false)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=Abinaya23062005&layout=compact&theme=dark&title_color=e8c547&text_color=eef2f6&bg_color=0e1318&border_color=e8c547)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=e8c547&height=120&section=footer&fontColor=ffffff&animation=fadeIn" width="100%"/>

**⭐ Star this repo if you found it useful!**

*Built with ❤️ and lots of code in Chennai, Tamil Nadu 🇮🇳*

*© 2025 Abinaya · Full Stack Developer · DSA Educator · AI Integrator*

</div>
