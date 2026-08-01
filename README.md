# WEB-WRLD Website

**Develop. Deploy. Dominate.**

## Project Structure

```
WEB-WRLD/
├── index.html          — Homepage
├── services.html       — Services detail page
├── portfolio.html      — Work showcase (filterable)
├── contact.html        — Contact + quote form
│
├── css/
│   ├── style.css       — Global styles & variables
│   ├── nav.css         — Navbar styles
│   └── animations.css  — Keyframes & transitions
│
├── js/
│   ├── techcircle.js   — Rotating tech circle canvas
│   └── main.js         — Scroll, nav, reveal animations
│
└── assets/
    ├── logo.png         ← DROP YOUR W LOGO HERE
    └── images/          ← Portfolio screenshots go here
```

## Setup in VS Code

1. Open VS Code
2. File > Open Folder > select this WEB-WRLD folder
3. Install extension: **Live Server** (by Ritwick Dey)
4. Right-click `index.html` → **Open with Live Server**
5. Your site opens at `http://127.0.0.1:5500`

### GitHub Pages
1. Create a GitHub account
2. git init → git add . → git commit -m "initial"
3. Push to a new repo
4. Settings > Pages > Deploy from main branch

## Form Backend (contact.html)

The form currently shows a success message without sending email.
To make it actually send emails:
1. Sign up at formspree.io (free tier available)
2. Create a form and get your endpoint URL
3. In contact.html, replace the submitForm() function with a fetch() POST to your Formspree endpoint

## Tech Stack

- Pure HTML5 + CSS3 + Vanilla JavaScript
- Google Fonts: Rajdhani + Exo 2
- Canvas API for the tech circle animation
- No frameworks, no build tools — just open and go

---
Built by Brandon Nyika (WRLD) — WEB-WRLD © 2026
