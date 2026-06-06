"use client";

import { useState, useEffect } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0d0d0f;
    color: #e8e2d5;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  /* HEADER */
  .header {
    padding: 52px 0 40px;
    border-bottom: 1px solid #222;
    margin-bottom: 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #fff;
  }

  .header-title span {
    color: #c9a84c;
  }

  .header-meta {
    font-size: 13px;
    color: #666;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* SEARCH BAR */
  .search-wrap {
    display: flex;
    gap: 10px;
    margin-bottom: 56px;
  }

  .search-input {
    flex: 1;
    background: #161618;
    border: 1px solid #2a2a2e;
    color: #e8e2d5;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 14px 20px;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input::placeholder { color: #444; }
  .search-input:focus { border-color: #c9a84c; }

  .search-btn {
    background: #c9a84c;
    color: #0d0d0f;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.05em;
    padding: 14px 28px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .search-btn:hover { background: #e0bc5e; }
  .search-btn:active { transform: scale(0.98); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* SEARCH AUTOCOMPLETE */
  .search-wrap {
    position: relative;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin-top: 4px;
  }

  .results-list {
    background: #1a1a1e;
    border: 1px solid #2a2a2e;
    border-radius: 4px;
    overflow: hidden;
    max-height: 420px;
    overflow-y: auto;
    box-shadow: 0 16px 48px rgba(0,0,0,0.7);
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid #222;
  }

  .result-item:last-child { border-bottom: none; }
  .result-item:hover { background: #222226; }

  .result-thumb {
    width: 36px;
    height: 54px;
    object-fit: cover;
    border-radius: 2px;
    background: #222;
    flex-shrink: 0;
  }

  .result-thumb-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e1e22;
    border: 1px solid #2a2a2e;
  }

  .result-thumb-fallback::after {
    content: '';
    width: 14px;
    height: 14px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='1.5'%3E%3Crect x='2' y='2' width='20' height='20' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E") center/contain no-repeat;
  }

  .result-info { flex: 1; min-width: 0; }

  .result-title {
    font-size: 14px;
    font-weight: 500;
    color: #e8e2d5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-year {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
  }

  .result-add {
    font-size: 12px;
    color: #c9a84c;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  /* FILTERS */
  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }

  .filter-btn {
    background: transparent;
    border: 1px solid #2a2a2e;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 16px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn.active {
    background: #1e1e22;
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .filter-btn:hover:not(.active) {
    border-color: #444;
    color: #bbb;
  }

  /* GRID */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 28px;
  }

  /* CARD */
  .card {
    position: relative;
    cursor: pointer;
    group: true;
  }

  .card-poster-wrap {
    position: relative;
    aspect-ratio: 2/3;
    border-radius: 4px;
    overflow: hidden;
    background: #161618;
    margin-bottom: 12px;
  }

  .card-poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease, filter 0.3s;
  }

  .card:hover .card-poster {
    transform: scale(1.04);
    filter: brightness(0.6);
  }

  .card-no-poster {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #444;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .card-no-poster svg { opacity: 0.3; }

  .card-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .card:hover .card-overlay { opacity: 1; }

  .card-watched-btn {
    background: #c9a84c;
    color: #0d0d0f;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 8px 12px;
    border-radius: 2px;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s;
  }

  .card-watched-btn.watched {
    background: #2a5c3f;
    color: #6fcf97;
  }

  .card-remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.7);
    border: 1px solid #333;
    color: #999;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s, color 0.2s;
  }

  .card:hover .card-remove-btn { opacity: 1; }
  .card-remove-btn:hover { color: #e05c5c; }

  .card-watched-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #2a5c3f;
    color: #6fcf97;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: 2px;
  }

  .card-info { }

  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 400;
    color: #e8e2d5;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .card-year {
    font-size: 12px;
    color: #555;
  }

  /* MODAL */
  .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal {
    background: #141416;
    border: 1px solid #222;
    border-radius: 6px;
    max-width: 760px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    gap: 0;
    position: relative;
  }

  .modal-poster {
    width: 240px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 6px 0 0 6px;
  }

  .modal-no-poster {
    width: 240px;
    flex-shrink: 0;
    background: #161618;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    border-radius: 6px 0 0 6px;
  }

  .modal-body {
    padding: 36px 32px;
    flex: 1;
    min-width: 0;
  }

  .modal-genre {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 10px;
  }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .modal-meta {
    font-size: 13px;
    color: #555;
    margin-bottom: 20px;
  }

  .modal-rating {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #1e1e22;
    padding: 6px 12px;
    border-radius: 2px;
    font-size: 13px;
    color: #c9a84c;
    margin-bottom: 20px;
  }

  .modal-synopsis {
    font-size: 14px;
    line-height: 1.7;
    color: #999;
    margin-bottom: 28px;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .modal-watched-btn {
    background: #c9a84c;
    color: #0d0d0f;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.05em;
    padding: 10px 22px;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .modal-watched-btn.watched {
    background: #2a5c3f;
    color: #6fcf97;
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: 1px solid #333;
    color: #888;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: color 0.2s, border-color 0.2s;
  }

  .modal-close:hover { color: #fff; border-color: #666; }

  /* SETTINGS */
  .settings-btn {
    background: transparent;
    border: 1px solid #2a2a2e;
    color: #555;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    flex-shrink: 0;
  }

  .settings-btn:hover { color: #c9a84c; border-color: #c9a84c; }

  .settings-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 340px;
    height: 100vh;
    background: #0f0f11;
    border-left: 1px solid #222;
    z-index: 200;
    display: flex;
    flex-direction: column;
    box-shadow: -20px 0 60px rgba(0,0,0,0.6);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .settings-panel.open { transform: translateX(0); }

  .settings-overlay {
    position: fixed;
    inset: 0;
    z-index: 199;
    background: rgba(0,0,0,0);
    pointer-events: none;
    transition: background 0.3s;
  }

  .settings-overlay.open {
    background: rgba(0,0,0,0.5);
    pointer-events: all;
  }

  .settings-header {
    padding: 28px 24px 20px;
    border-bottom: 1px solid #1e1e22;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .settings-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .settings-close {
    background: transparent;
    border: 1px solid #2a2a2e;
    color: #666;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    transition: color 0.2s, border-color 0.2s;
  }

  .settings-close:hover { color: #fff; border-color: #555; }

  .settings-body { padding: 24px; flex: 1; overflow-y: auto; }

  .settings-section-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 14px;
  }

  .contributors-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .contributor-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #161618;
    border: 1px solid #222;
    border-radius: 4px;
    padding: 10px 12px;
  }

  .contributor-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #1e1e22;
    border: 1px solid #2a2a2e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #c9a84c;
    font-weight: 500;
    flex-shrink: 0;
    font-family: 'Playfair Display', serif;
  }

  .contributor-name {
    flex: 1;
    font-size: 14px;
    color: #e8e2d5;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contributor-remove {
    background: transparent;
    border: none;
    color: #444;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    padding: 2px 4px;
    transition: color 0.2s;
    flex-shrink: 0;
  }

  .contributor-remove:hover { color: #e05c5c; }

  .add-contributor-row {
    display: flex;
    gap: 8px;
  }

  .add-contributor-input {
    flex: 1;
    background: #161618;
    border: 1px solid #2a2a2e;
    color: #e8e2d5;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
  }

  .add-contributor-input::placeholder { color: #333; }
  .add-contributor-input:focus { border-color: #c9a84c; }

  .add-contributor-btn {
    background: #1e1e22;
    border: 1px solid #2a2a2e;
    color: #c9a84c;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s, border-color 0.2s;
  }

  .add-contributor-btn:hover { background: #252528; border-color: #c9a84c; }

  .settings-hint {
    font-size: 12px;
    color: #333;
    margin-top: 12px;
    line-height: 1.5;
  }

  /* EMPTY STATE */
  .empty {
    text-align: center;
    padding: 80px 24px;
    color: #333;
  }

  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }

  .empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #444;
    margin-bottom: 8px;
  }

  .empty-sub { font-size: 14px; color: #333; }

  /* LOADING SPINNER */
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid #333;
    border-top-color: #c9a84c;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  html { overflow-y: scroll; }

  @media (max-width: 600px) {
    .modal { flex-direction: column; }
    .modal-poster, .modal-no-poster { width: 100%; height: 280px; border-radius: 6px 6px 0 0; }
    .search-btn { padding: 14px 18px; }
  }
`;

// ---------------------------------------------------------------------------
// localStorage helpers (fallback only)
// ---------------------------------------------------------------------------
function lsGet(key, fallback) {
	try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function lsSet(key, value) {
	try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function App() {
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const [watchlist, setWatchlist] = useState([]);
	const [filter, setFilter] = useState("all");
	const [modal, setModal] = useState(null);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [contributors, setContributors] = useState([]);
	const [newName, setNewName] = useState("");
	const [loading, setLoading] = useState(true);

	// Load watchlist — Sheets first, localStorage fallback
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/watchlist");
				const data = await res.json();
				if (data.ok && Array.isArray(data.data)) {
					setWatchlist(data.data);
					lsSet("watchlist", data.data);
				} else {
					throw new Error("bad response");
				}
			} catch {
				setWatchlist(lsGet("watchlist", []));
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// Load contributors — Sheets first, localStorage fallback
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/settings");
				const data = await res.json();
				if (data.ok && Array.isArray(data.contributors)) {
					setContributors(data.contributors);
					lsSet("contributors", data.contributors);
				} else {
					throw new Error("bad response");
				}
			} catch {
				setContributors(lsGet("contributors", []));
			}
		})();
	}, []);

	async function addContributor() {
		const name = newName.trim();
		if (!name || contributors.includes(name)) return;
		const next = [...contributors, name];
		setContributors(next);
		lsSet("contributors", next);
		setNewName("");
		try {
			await fetch("/api/settings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
		} catch {}
	}

	async function removeContributor(name) {
		const next = contributors.filter(n => n !== name);
		setContributors(next);
		lsSet("contributors", next);
		try {
			await fetch("/api/settings", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
		} catch {}
	}

	const listTitle = contributors.length === 0
		? "My Watchlist"
		: contributors.length === 1
			? `${contributors[0]}'s Watchlist`
			: contributors.length === 2
				? `${contributors[0]} & ${contributors[1]}'s Watchlist`
				: `${contributors.slice(0, -1).join(", ")} & ${contributors[contributors.length - 1]}'s Watchlist`;

	useEffect(() => {
		if (!query.trim()) { setSearchResults([]); return; }
		const timer = setTimeout(() => doSearch(query), 400);
		return () => clearTimeout(timer);
	}, [query]);

	async function doSearch(q) {
		if (!q.trim()) return;
		setSearching(true);
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
			const data = await res.json();
			setSearchResults(data.results || []);
		} catch { setSearchResults([]); }
		setSearching(false);
	}

	async function addMovie(id) {
		if (watchlist.find(m => m.imdbID === id)) {
			setSearchResults([]);
			setQuery("");
			return;
		}
		try {
			const res = await fetch(`/api/movie?id=${encodeURIComponent(id)}`);
			const data = await res.json();
			if (!data.error) {
				const movie = { ...data, watched: false };
				const next = [movie, ...watchlist];
				setWatchlist(next);
				lsSet("watchlist", next);
				try {
					await fetch("/api/watchlist", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(movie),
					});
				} catch {}
			}
		} catch {}
		setSearchResults([]);
		setQuery("");
	}

	async function toggleWatched(imdbID) {
		let next;
		setWatchlist(prev => {
			const updated = prev.map(m => m.imdbID === imdbID ? { ...m, watched: !m.watched } : m);
			const movie = updated.find(m => m.imdbID === imdbID);
			next = movie.watched
				? [...updated.filter(m => m.imdbID !== imdbID), movie]
				: [movie, ...updated.filter(m => m.imdbID !== imdbID)];
			return next;
		});
		if (modal?.imdbID === imdbID) setModal(prev => ({ ...prev, watched: !prev.watched }));
		// Persist after state settles
		setTimeout(() => {
			if (next) lsSet("watchlist", next);
		}, 0);
		const movie = watchlist.find(m => m.imdbID === imdbID);
		try {
			await fetch("/api/watchlist", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imdbID, watched: !movie?.watched }),
			});
		} catch {}
	}

	async function removeMovie(imdbID) {
		const next = watchlist.filter(m => m.imdbID !== imdbID);
		setWatchlist(next);
		lsSet("watchlist", next);
		if (modal?.imdbID === imdbID) setModal(null);
		try {
			await fetch(`/api/watchlist?id=${encodeURIComponent(imdbID)}`, { method: "DELETE" });
		} catch {}
	}

	const filtered = watchlist.filter(m => {
		if (filter === "watched") return m.watched;
		if (filter === "unwatched") return !m.watched;
		return true;
	});

	const counts = {
		all: watchlist.length,
		watched: watchlist.filter(m => m.watched).length,
		unwatched: watchlist.filter(m => !m.watched).length,
	};

	return (
		<>
			<style>{style}</style>
			<div className="app">
				<header className="header">
					<div>
						<h1 className="header-title">
							{contributors.length === 0
								? <>My <span>Watchlist</span></>
								: (() => {
									const parts = listTitle.split("Watchlist");
									return <>{parts[0]}<span>Watchlist</span>{parts[1]}</>;
								})()
							}
						</h1>
					</div>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<div className="header-meta">{counts.all} films · {counts.watched} watched</div>
						<button className="settings-btn" onClick={() => setSettingsOpen(true)} title="Settings" aria-label="Settings">
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
								<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
							</svg>
						</button>
					</div>
				</header>

				{/* Search */}
				<div className="search-wrap">
					<input
						className="search-input"
						type="text"
						placeholder="Search for a movie to add…"
						value={query}
						onChange={e => setQuery(e.target.value)}
						onKeyDown={e => e.key === "Enter" && doSearch(query)}
					/>
					<button className="search-btn" onClick={() => doSearch(query)} disabled={searching}>
						{searching ? <span className="spinner" /> : "Search"}
					</button>
					{searchResults.length > 0 && (
						<div className="search-results">
							<div className="results-list">
								{searchResults.map(r => (
									<div className="result-item" key={r.imdbID} onClick={() => addMovie(r.imdbID)}>
										{r.Poster && r.Poster !== "N/A"
											? <img className="result-thumb" src={r.Poster} alt=""
													onError={e => { e.currentTarget.replaceWith(Object.assign(document.createElement("div"), { className: "result-thumb result-thumb-fallback" })); }}
												/>
											: <div className="result-thumb result-thumb-fallback" />}
										<div className="result-info">
											<div className="result-title">{r.Title}</div>
											<div className="result-year">{r.Year}</div>
										</div>
										<span className="result-add">
											{watchlist.find(m => m.imdbID === r.imdbID) ? "Added ✓" : "+ Add"}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Filters */}
				{watchlist.length > 0 && (
					<div className="filters">
						{["all", "unwatched", "watched"].map(f => (
							<button
								key={f}
								className={`filter-btn ${filter === f ? "active" : ""}`}
								onClick={() => setFilter(f)}
							>
								{f === "all" ? `All (${counts.all})` : f === "watched" ? `Watched (${counts.watched})` : `To Watch (${counts.unwatched})`}
							</button>
						))}
					</div>
				)}

				{/* Grid */}
				{loading ? (
					<div className="empty">
						<div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
							<span className="spinner" style={{ width: "28px", height: "28px" }} />
						</div>
						<div className="empty-title" style={{ fontSize: "16px" }}>Loading your watchlist…</div>
					</div>
				) : filtered.length === 0 ? (
					<div className="empty">
						<div className="empty-icon">🎬</div>
						<div className="empty-title">{watchlist.length === 0 ? "Your watchlist is empty" : "Nothing here yet"}</div>
						<div className="empty-sub">{watchlist.length === 0 ? "Search for a film above to get started" : "Try a different filter"}</div>
					</div>
				) : (
					<div className="grid">
						{filtered.map(movie => (
							<div className="card" key={movie.imdbID} onClick={() => setModal(movie)}>
								<div className="card-poster-wrap">
									{movie.Poster && movie.Poster !== "N/A"
										? <img className="card-poster" src={movie.Poster} alt={movie.Title} />
										: <div className="card-no-poster">
											<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
											No Poster
										</div>
									}
									{movie.watched && <div className="card-watched-badge">Watched</div>}
									<div className="card-overlay">
										<button
											className={`card-watched-btn ${movie.watched ? "watched" : ""}`}
											onClick={e => { e.stopPropagation(); toggleWatched(movie.imdbID); }}
										>
											{movie.watched ? "✓ Watched" : "Mark as Watched"}
										</button>
									</div>
									<button
										className="card-remove-btn"
										onClick={e => { e.stopPropagation(); removeMovie(movie.imdbID); }}
										title="Remove"
									>×</button>
								</div>
								<div className="card-info">
									<div className="card-title">{movie.Title}</div>
									<div className="card-year">{movie.Year}</div>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Modal */}
				{modal && (
					<div className="modal-bg" onClick={() => setModal(null)}>
						<div className="modal" onClick={e => e.stopPropagation()}>
							{modal.Poster && modal.Poster !== "N/A"
								? <img className="modal-poster" src={modal.Poster} alt={modal.Title} />
								: <div className="modal-no-poster">
									<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
								</div>
							}
							<div className="modal-body">
								{modal.Genre && modal.Genre !== "N/A" && (
									<div className="modal-genre">{modal.Genre}</div>
								)}
								<div className="modal-title">{modal.Title}</div>
								<div className="modal-meta">{modal.Year}{modal.Runtime && modal.Runtime !== "N/A" ? ` · ${modal.Runtime}` : ""}{modal.Director && modal.Director !== "N/A" ? ` · Dir. ${modal.Director}` : ""}</div>
								{modal.imdbRating && modal.imdbRating !== "N/A" && (
									<div className="modal-rating">
										★ {modal.imdbRating} <span style={{ color: "#444", fontSize: "11px" }}>IMDb</span>
									</div>
								)}
								<p className="modal-synopsis">
									{modal.Plot && modal.Plot !== "N/A" ? modal.Plot : "No synopsis available."}
								</p>
								<div className="modal-actions">
									<button
										className={`modal-watched-btn ${modal.watched ? "watched" : ""}`}
										onClick={() => toggleWatched(modal.imdbID)}
									>
										{modal.watched ? "✓ Watched" : "Mark as Watched"}
									</button>
									<button
										style={{ background: "transparent", border: "1px solid #333", color: "#888", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", padding: "10px 22px", borderRadius: "3px", cursor: "pointer" }}
										onClick={() => removeMovie(modal.imdbID)}
									>
										Remove
									</button>
								</div>
							</div>
							<button className="modal-close" onClick={() => setModal(null)}>×</button>
						</div>
					</div>
				)}
			</div>

			{/* Settings overlay */}
			<div className={`settings-overlay ${settingsOpen ? "open" : ""}`} onClick={() => setSettingsOpen(false)} />

			{/* Settings panel */}
			<aside className={`settings-panel ${settingsOpen ? "open" : ""}`}>
				<div className="settings-header">
					<span className="settings-title">Settings</span>
					<button className="settings-close" onClick={() => setSettingsOpen(false)}>×</button>
				</div>
				<div className="settings-body">
					<div className="settings-section-label">List Contributors</div>
					{contributors.length > 0 && (
						<div className="contributors-list">
							{contributors.map(name => (
								<div className="contributor-row" key={name}>
									<div className="contributor-avatar">{name[0].toUpperCase()}</div>
									<span className="contributor-name">{name}</span>
									<button className="contributor-remove" onClick={() => removeContributor(name)} title="Remove">×</button>
								</div>
							))}
						</div>
					)}
					<div className="add-contributor-row">
						<input
							className="add-contributor-input"
							type="text"
							placeholder="Add a name…"
							value={newName}
							onChange={e => setNewName(e.target.value)}
							onKeyDown={e => e.key === "Enter" && addContributor()}
						/>
						<button className="add-contributor-btn" onClick={addContributor}>Add</button>
					</div>
					<p className="settings-hint">
						Names appear in the watchlist title. The list title updates automatically as you add or remove people.
					</p>
				</div>
			</aside>
		</>
	);
}
