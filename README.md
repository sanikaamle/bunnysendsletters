# PetalPost

A dreamy, scrapbook-style digital letter-writing app. Write a letter,
decorate it with stickers and photos, and share it with a link.

## Stack

- **Frontend:** React + Vite + Tailwind, React Router, Zustand, Framer Motion
- **Auth, database, file storage:** Firebase (Auth, Firestore, Storage)

There's no custom backend to host — Firebase handles login, saving
letters, and storing uploaded photos. That also means it's simple to
deploy: it's just a static site once built.

## How sending works

There's no email delivery. When you hit **Send Letter**, PetalPost
saves it and gives you a shareable link
(`https://yoursite.com/view/<letterId>`) with a **Copy Link** button.
You send that link however you want — text, email, DM, whatever.
Opening the link plays the same envelope-opening reveal, no account
required on the recipient's end.

## Setup

### 1. Create a Firebase project

1. Go to https://console.firebase.google.com and create a project (the
   free "Spark" plan is enough for this - no credit card needed).
2. **Project settings → General → Your apps** → add a **Web app**.
   Firebase shows you a config object — you'll need those values next.
3. **Build → Authentication → Sign-in method** → enable **Email/Password**.
4. **Build → Firestore Database** → Create database (test mode is fine
   to start; see "Before you deploy for real" below).

Photos are compressed client-side and stored as part of each letter's
Firestore document, so Firebase Storage isn't used — this app stays
entirely on the free Spark plan, no linked card required.

### 2. Configure the app

```bash
cp .env.example .env
```
Fill in the six `VITE_FIREBASE_*` values from step 1.2 above.

### 3. Install and run

```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`. Sign up, write a letter, hit Send,
and you'll get a real link back.

## Before you deploy for real

Firestore "test mode" rules allow anyone to read/write anything, which
is fine for local development but not for a public site. This project
includes `firestore.rules` with the actual access rules PetalPost
needs (owners can edit their own letters, sent letters are readable
via their link). Apply them with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init   # choose Firestore, point at this project
firebase deploy --only firestore:rules
```

## Deploying the site

It's a static Vite build, so any static host works — Firebase
Hosting, Vercel, Netlify, GitHub Pages, etc.

```bash
npm run build
```
Deploy the `dist/` folder. Set the same `VITE_FIREBASE_*` environment
variables in your hosting provider's dashboard (don't commit `.env`).

## Project structure

```
src/
  pages/{Landing,Dashboard,Editor,Preview,Letterbox,Auth,PublicView}/
  components/{layout,ui,editor,landing,preview}/
  store/          - authStore.js (Firebase Auth), lettersStore.js (Firestore)
  lib/
    firebase.js   - Firebase app init
    letterModel.js - shared Letter/Decoration shape + paper/font/sticker options
  assets/stickers/{flowers,stars,hearts,stamps,tape,teddy,misc}/
```

To add your own sticker art: drop PNG/WebP files into the matching
`assets/stickers/<category>/` folder and register them in
`src/components/editor/stickerLibrary.js`. Nothing else needs to change.
