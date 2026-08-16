# Bunnysendsletters

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
