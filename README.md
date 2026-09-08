# 🚀 Abinaya Portfolio v2 — Fully Upgraded

## What's new in v2

### Frontend
- ✅ Custom glowing cursor effect
- ✅ Preloader (no flash on first load)
- ✅ Scroll progress bar (gold line at top)
- ✅ Hero typing animation (cycles through phrases)
- ✅ Animated number counters (scroll-triggered)
- ✅ Parallax effect on hero background blob
- ✅ Projects section (6 real projects with live/GitHub links)
- ✅ Testimonials section (3 reviews)
- ✅ FAQ accordion section (6 questions)
- ✅ Back to top button (appears after scrolling)
- ✅ Floating Apply Now button (mobile)
- ✅ WhatsApp direct chat link (wa.me)
- ✅ Real LinkedIn & GitHub links
- ✅ Form auto-save (localStorage — survives accidental refresh)
- ✅ Social share buttons in footer (WhatsApp, LinkedIn, Twitter)
- ✅ OG / social preview meta tags (nice card when shared)
- ✅ Google Font preconnect (faster loading)
- ✅ Expanded footer with links grid
- ✅ Theme preference saved to localStorage
- ✅ Skill bars now scroll-triggered (animate on scroll into view)

### Backend / Admin
- ✅ Auto-reply email to applicant on form submission
- ✅ Reply button in admin (opens Gmail compose with pre-filled email)
- ✅ Export to CSV button (Applications + Messages separately)
- ✅ Sitemap.xml at /sitemap.xml
- ✅ Robots.txt at /robots.txt
- ✅ CSP fix (script-src-attr — form submit button now works)

---

## ⚡ Quick Start

```powershell
cd project
npm install
copy .env.example .env
npm start
```

- Website → http://localhost:3000
- Admin   → http://localhost:3000/admin  (abinaya / Abinaya@2025)

---

## 📧 Setup Gmail Notifications

1. Go to → https://myaccount.google.com/apppasswords
2. Select Mail → Generate
3. Copy the 16-letter password into .env as EMAIL_PASS
4. Restart: npm start

---

## 📋 Admin Panel Features

- Live stats (applications, messages, page views)
- Sound + flash alert for new applications (every 5 seconds check)
- ↗ Reply button — opens Gmail compose with pre-filled email
- ⬇ Export Apps CSV — download all applications as Excel-ready CSV
- ⬇ Export Msgs CSV — download all messages
- Update status (New / Read / Replied / Closed)
- Delete records

---

## 🔧 Personalise Your Site

Open public/index.html and update:
- LinkedIn URL (search "linkedin.com/in/abinaya")
- GitHub URL (search "Abinaya23062005")
- Project links (search "nyayaai-beta.vercel.app")
- Testimonial names/roles to real people who can vouch for you

---

Built by Abinaya · Chennai, Tamil Nadu 🇮🇳
