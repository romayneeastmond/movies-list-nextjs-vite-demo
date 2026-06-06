# Movies Watchlist

A dark, cinematic movie watchlist app built with Next.js. Search for films, track what you want to watch, and mark them as watched.

## Features

- **Movie search** — autocomplete dropdown powered by OMDB and TMDB APIs, overlays the page without pushing content down
- **Detail modal** — poster, synopsis, runtime, director, and IMDb rating for every film
- **Watch status** — mark films watched/unwatched; watched films sort to the bottom
- **Filters** — view All, To Watch, or Watched
- **Named contributors** — add names to personalise the list title (e.g. "Elizabeth & Romayne's Watchlist")
- **Persistent** — watchlist and contributors saved in localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root:

```
OMDB_KEY=your_omdb_key
TMDB_KEY=your_tmdb_key
```

- **OMDB key** — free at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) (1,000 req/day)
- **TMDB key** — free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

Keys are read server-side via the Next.js API routes and are never exposed to the client.

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add `OMDB_KEY` and `TMDB_KEY` under **Settings → Environment Variables**
4. Deploy
