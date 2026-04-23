# 🎂 Buon Compleanno Claudia — Guida al Setup

Un sito web regalo con una foto al giorno per i 18 anni di Claudia (26 maggio).

---

## 📁 Struttura del progetto

```
claudia18/
├── public/
│   └── photos/           ← METTI QUI LE TUE 41 FOTO
│       ├── photo_01.jpg
│       ├── photo_02.jpg
│       ├── ...
│       └── photo_41.jpg
├── src/
│   ├── app/
│   │   ├── page.tsx      ← App principale
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       └── data.ts       ← ← ← MODIFICA LE DEDICHE QUI
```

---

## 🖼️ Passo 1 — Aggiungi le foto

Metti le tue 41 foto nella cartella `public/photos/` con questi nomi esatti:

```
photo_01.jpg
photo_02.jpg
photo_03.jpg
...
photo_41.jpg
```

> **Consiglio**: rinomina le foto in ordine cronologico (dalla più vecchia alla più recente). La foto `photo_41.jpg` sarà quella del giorno del compleanno.

I formati supportati sono `.jpg`, `.jpeg`, `.png`, `.webp` — basta che il nome del file in `data.ts` corrisponda.

---

## ✏️ Passo 2 — Modifica le dediche (opzionale)

Apri il file `src/lib/data.ts`.

Cerca l'array `photos` e modifica il campo `dedica` per ogni foto:

```typescript
{
  id: 1,
  filename: "photo_01.jpg",
  emoji: "🌅",
  dedica: "Scrivi qui la tua dedica personale per questa foto!"
},
```

Puoi anche cambiare l'emoji di ogni foto. Tutte le dediche sono già pre-generate dall'AI — modificale solo se vuoi personalizzarle ulteriormente.

---

## 🚀 Passo 3 — Deploy su Vercel

### 3a. Crea il repository GitHub

1. Vai su [github.com](https://github.com) e crea un nuovo repository (es. `claudia18`)
2. Copia tutti i file del progetto nel repository
3. Fai il commit e il push

```bash
git init
git add .
git commit -m "Sito regalo Claudia"
git branch -M main
git remote add origin https://github.com/TUOUSERNAME/claudia18.git
git push -u origin main
```

### 3b. Collega Vercel

1. Vai su [vercel.com](https://vercel.com) e fai login
2. Clicca **"New Project"**
3. Importa il repository GitHub `claudia18`
4. Le impostazioni sono già configurate — clicca **"Deploy"**
5. In pochi minuti il sito è online!

### 3c. Dominio personalizzato (opzionale)

In Vercel, vai su **Settings → Domains** e aggiungi un dominio tipo `claudia18anni.it` se ne hai uno.

---

## 📅 Come funziona la logica delle foto

- **Nei 40 giorni prima del 26 maggio**: ogni giorno viene mostrata una foto diversa (dalla 1 alla 40), con il conto alla rovescia
- **Il 26 maggio**: viene mostrata la foto finale (la 41esima), effetti speciali, coriandoli e il banner di compleanno
- **Fuori dalla finestra dei 41 giorni**: le foto si alternano ciclicamente
- **L'album cresce**: ogni giorno che passa, la foto mostrata viene aggiunta all'album e non sparisce mai

---

## 🎊 Giorno del compleanno

Il 26 maggio dalle 00:00 alle 23:59, il sito mostra automaticamente:
- 🎊 Coriandoli animati a schermo
- 🎂 Banner speciale di buon compleanno
- Tutte le 41 foto svelate nell'album

---

## 🛠️ Sviluppo locale

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## ❓ Domande frequenti

**Le foto non compaiono?**
Controlla che i nomi dei file in `public/photos/` corrispondano esattamente a quelli in `data.ts` (maiuscole/minuscole incluse).

**Voglio testare il compleanno?**
Cambia temporaneamente in `data.ts` la riga `export const BIRTHDAY = { day: 26, month: 5 }` con la data di oggi.

**Posso cambiare il nome?**
Sì, modifica `export const NAME = "Claudia"` in `data.ts`.

---

Fatto con ❤️ per un regalo speciale.
