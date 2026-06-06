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

  .search-input-wrap {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .search-clear {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: #555;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 2px 4px;
    transition: color 0.2s;
  }

  .search-clear:hover { color: #ccc; }

  .search-input {
    width: 100%;
    background: #161618;
    border: 1px solid #2a2a2e;
    color: #e8e2d5;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 14px 40px 14px 20px;
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

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .card-title { font-size: 12px; }
    .card-year  { font-size: 11px; }
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
    background: #141416;
    border: 1px solid #444;
    color: #aaa;
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

  /* CONFIRM MODAL */
  .confirm-bg {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    backdrop-filter: blur(3px);
  }

  .confirm-box {
    background: #141416;
    border: 1px solid #2a2a2e;
    border-radius: 6px;
    padding: 32px 28px 24px;
    max-width: 360px;
    width: 100%;
    text-align: center;
  }

  .confirm-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .confirm-sub {
    font-size: 13px;
    color: #666;
    margin-bottom: 28px;
    line-height: 1.5;
  }

  .confirm-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .confirm-cancel {
    background: transparent;
    border: 1px solid #333;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 10px 22px;
    border-radius: 3px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .confirm-cancel:hover { border-color: #555; color: #ccc; }

  .confirm-remove {
    background: #7a2020;
    border: none;
    color: #f4a0a0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 22px;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .confirm-remove:hover { background: #922626; }

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

  /* VIEW TOGGLE */
  .view-toggle {
    display: flex;
    gap: 4px;
    margin-left: auto;
  }

  .view-btn {
    background: transparent;
    border: 1px solid #2a2a2e;
    color: #555;
    width: 32px;
    height: 32px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }

  .view-btn.active {
    background: #1e1e22;
    border-color: #c9a84c;
    color: #c9a84c;
  }

  .view-btn:hover:not(.active) { border-color: #444; color: #bbb; }

  /* LIST VIEW */
  .list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
  }

  .list-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 14px;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid #1a1a1e;
    border-left: 3px solid transparent;
    width: 100%;
    box-sizing: border-box;
  }

  .list-row.watched-row { border-left-color: #2a5c3f; }
  .list-row:hover { background: #161618; }

  .list-row.watched-row .list-title {
    color: #888;
  }

  .list-thumb {
    width: 32px;
    height: 48px;
    object-fit: cover;
    border-radius: 2px;
    background: #1e1e22;
    flex-shrink: 0;
  }

  .list-thumb-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e1e22;
    border: 1px solid #2a2a2e;
    color: #333;
  }

  .list-title-col {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .list-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    color: #e8e2d5;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-year {
    font-size: 12px;
    color: #555;
    flex-shrink: 0;
    width: 44px;
  }

  .list-rating {
    font-size: 12px;
    color: #c9a84c;
    flex-shrink: 0;
    width: 44px;
  }

  .list-watched-badge {
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6fcf97;
    background: #2a5c3f;
    padding: 3px 7px;
    border-radius: 2px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .list-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .list-action-btn {
    background: transparent;
    border: 1px solid #2a2a2e;
    color: #666;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 2px;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.2s, border-color 0.2s;
  }

  .list-action-btn:hover { color: #c9a84c; border-color: #c9a84c; }
  .list-action-btn.remove:hover { color: #e05c5c; border-color: #e05c5c; }

  /* FOOTER */
  .footer {
    margin-top: 80px;
    padding: 28px 0 32px;
    border-top: 1px solid #1a1a1e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .footer-copy {
    font-size: 12px;
    color: #333;
    letter-spacing: 0.04em;
  }

  .footer-link {
    font-size: 12px;
    color: #555;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
    letter-spacing: 0.04em;
  }

  .footer-link:hover { color: #c9a84c; }

  /* BACK TO TOP */
  .back-to-top {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 40px;
    height: 40px;
    background: #1e1e22;
    border: 1px solid #2a2a2e;
    color: #888;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 50;
    transition: opacity 0.3s, transform 0.3s, color 0.2s, border-color 0.2s;
  }

  .back-to-top.hidden { opacity: 0; transform: translateY(12px); pointer-events: none; }
  .back-to-top:hover { color: #c9a84c; border-color: #c9a84c; }

  @media (max-width: 600px) {
    .modal { flex-direction: column; }
    .modal-poster, .modal-no-poster { width: 100%; height: 280px; border-radius: 6px 6px 0 0; }
    .search-btn { padding: 14px 18px; }
    .back-to-top { bottom: 20px; right: 20px; }
    .list-rating { display: none; }
    .list-watched-badge { display: none; }
    .list-actions { display: none; }
  }

  @media (hover: none) {
    .card-remove-btn { opacity: 1; }
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
	const [mounted, setMounted] = useState(false);
	const [confirmRemove, setConfirmRemove] = useState(null);
	const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
	const [showTop, setShowTop] = useState(false);

	useEffect(() => { setMounted(true); }, []);

	useEffect(() => {
		const onScroll = () => setShowTop(window.scrollY > 400);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

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

	const displayed = viewMode === "list"
		? [...filtered].sort((a, b) => a.Title.localeCompare(b.Title))
		: filtered;

	const counts = {
		all: watchlist.length,
		watched: watchlist.filter(m => m.watched).length,
		unwatched: watchlist.filter(m => !m.watched).length,
	};

	if (!mounted) return null;

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
					<div className="search-input-wrap">
						<input
							className="search-input"
							type="text"
							placeholder="Search for a movie to add…"
							value={query}
							onChange={e => setQuery(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter") doSearch(query);
								if (e.key === "Escape") { setQuery(""); setSearchResults([]); }
							}}
						/>
						{(query || searchResults.length > 0) && (
							<button className="search-clear" onClick={() => { setQuery(""); setSearchResults([]); }} aria-label="Clear search">×</button>
						)}
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
					<button className="search-btn" onClick={() => doSearch(query)} disabled={searching}>
						{searching ? <span className="spinner" /> : "Search"}
					</button>
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
						<div className="view-toggle">
							<button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid view" aria-label="Grid view">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1"/><rect x="8" y="0" width="6" height="6" rx="1"/><rect x="0" y="8" width="6" height="6" rx="1"/><rect x="8" y="8" width="6" height="6" rx="1"/></svg>
							</button>
							<button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List view" aria-label="List view">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="1" width="14" height="2" rx="1"/><rect x="0" y="6" width="14" height="2" rx="1"/><rect x="0" y="11" width="14" height="2" rx="1"/></svg>
							</button>
						</div>
					</div>
				)}

				{/* Grid / List */}
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
				) : viewMode === "grid" ? (
					<div className="grid">
						{displayed.map(movie => (
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
										onClick={e => { e.stopPropagation(); setConfirmRemove(movie); }}
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
				) : (
					<div className="list">
						{displayed.map(movie => (
							<div className={`list-row ${movie.watched ? "watched-row" : ""}`} key={movie.imdbID} onClick={() => setModal(movie)}>
								{movie.Poster && movie.Poster !== "N/A"
									? <img className="list-thumb" src={movie.Poster} alt="" />
									: <div className="list-thumb list-thumb-fallback">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
									</div>
								}
								<div className="list-title-col">
									<div className="list-title">{movie.Title}</div>
									{movie.watched && <div className="list-watched-badge">Watched</div>}
								</div>
								<div className="list-year">{movie.Year}</div>
								<div className="list-rating">
									{movie.imdbRating && movie.imdbRating !== "N/A" ? `★ ${movie.imdbRating}` : " "}
								</div>
								<div className="list-actions" onClick={e => e.stopPropagation()}>
									<button className="list-action-btn" onClick={() => toggleWatched(movie.imdbID)}>
										{movie.watched ? "Unwatch" : "Watched"}
									</button>
									<button className="list-action-btn remove" onClick={() => setConfirmRemove(movie)}>Remove</button>
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
										onClick={() => setConfirmRemove(modal)}
									>
										Remove
									</button>
								</div>
							</div>
							<button className="modal-close" onClick={() => setModal(null)}>×</button>
						</div>
					</div>
				)}
				<footer className="footer">
					<span className="footer-copy">© {new Date().getFullYear()} Movies Watchlist</span>
					<a className="footer-link" href="https://github.com/romayneeastmond/movies-list-nextjs-vite-demo" target="_blank" rel="noopener noreferrer">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
						Source on GitHub
					</a>
				</footer>
			</div>

			{/* Confirm remove modal */}
			{confirmRemove && (
				<div className="confirm-bg" onClick={() => setConfirmRemove(null)}>
					<div className="confirm-box" onClick={e => e.stopPropagation()}>
						<div className="confirm-title">Remove film?</div>
						<div className="confirm-sub">
							<em>{confirmRemove.Title}</em> will be removed from your watchlist.
						</div>
						<div className="confirm-actions">
							<button className="confirm-cancel" onClick={() => setConfirmRemove(null)}>Cancel</button>
							<button className="confirm-remove" onClick={() => { removeMovie(confirmRemove.imdbID); setConfirmRemove(null); }}>Remove</button>
						</div>
					</div>
				</div>
			)}

			{/* Back to top */}
			<button
				className={`back-to-top ${showTop ? "" : "hidden"}`}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
				aria-label="Back to top"
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l5-5 5 5"/></svg>
			</button>

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
