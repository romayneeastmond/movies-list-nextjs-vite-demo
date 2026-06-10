import { google } from "googleapis";

const WATCHLIST_SHEET = "Watchlist";
const SETTINGS_SHEET = "Settings";

// Watchlist column order (A→N)
const WL_COLS = [
  "imdbID", "Title", "Year", "Poster", "Genre", "Runtime",
  "Director", "imdbRating", "Plot", "Watched", "DateAdded", "Source", "AddedBy", "Type",
];

// Settings column order (A→C)
const ST_COLS = ["Key", "Value", "UpdatedAt"];

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheets() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

const sheetId = () => process.env.GOOGLE_SHEET_ID;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rowToMovie(row) {
  const r = (i) => row[i] ?? "";
  return {
    imdbID:      r(0),
    Title:       r(1),
    Year:        r(2),
    Poster:      r(3),
    Genre:       r(4),
    Runtime:     r(5),
    Director:    r(6),
    imdbRating:  r(7),
    Plot:        r(8),
    watched:     r(9) === "TRUE",
    DateAdded:   r(10),
    Source:      r(11),
    AddedBy:     r(12),
    _type:       r(13) || undefined,
  };
}

function movieToRow(movie) {
  return [
    movie.imdbID    ?? "",
    movie.Title     ?? "",
    movie.Year      ?? "",
    movie.Poster    ?? "",
    movie.Genre     ?? "",
    movie.Runtime   ?? "",
    movie.Director  ?? "",
    movie.imdbRating ?? "",
    movie.Plot      ?? "",
    movie.watched ? "TRUE" : "FALSE",
    movie.DateAdded ?? new Date().toISOString().slice(0, 10),
    movie.Source    ?? (movie.imdbID?.startsWith("tmdb-") ? "tmdb" : "omdb"),
    movie.AddedBy   ?? "",
    movie._type     ?? "",
  ];
}

// Ensure a sheet tab exists with the right headers; returns all data rows (no header).
async function ensureSheet(sheets, name, headers) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId() });
  const exists = meta.data.sheets.some((s) => s.properties.title === name);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId(),
      requestBody: {
        requests: [{ addSheet: { properties: { title: name } } }],
      },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId(),
      range: `${name}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
    return [];
  }

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: `${name}!A:${String.fromCharCode(64 + headers.length)}`,
  });
  const [, ...rows] = res.data.values ?? [];
  return rows;
}

// Find the 1-based sheet row number for a given column index + value match.
async function findRowIndex(sheets, sheetName, colIndex, value) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: `${sheetName}!A:A`,
  });
  const rows = res.data.values ?? [];
  // rows includes the header at index 0; +1 converts 0-based to 1-based sheet row
  const idx = rows.findIndex((r) => r[colIndex] === value);
  return idx === -1 ? -1 : idx + 1;
}

// ---------------------------------------------------------------------------
// Watchlist
// ---------------------------------------------------------------------------

export async function getWatchlist() {
  const sheets = await getSheets();
  const rows = await ensureSheet(sheets, WATCHLIST_SHEET, WL_COLS);
  return rows.filter((r) => r[0]).map(rowToMovie);
}

export async function appendMovie(movie) {
  const sheets = await getSheets();
  await ensureSheet(sheets, WATCHLIST_SHEET, WL_COLS);
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId(),
    range: `${WATCHLIST_SHEET}!A:N`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [movieToRow(movie)] },
  });
}

export async function updateMovie(imdbID, changes) {
  const sheets = await getSheets();
  const rows = await ensureSheet(sheets, WATCHLIST_SHEET, WL_COLS);
  const rowIdx = rows.findIndex((r) => r[0] === imdbID);
  if (rowIdx === -1) throw new Error(`Movie not found: ${imdbID}`);

  const existing = rowToMovie(rows[rowIdx]);
  const updated = movieToRow({ ...existing, ...changes });
  const sheetRow = rowIdx + 2; // +1 header, +1 one-based

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId(),
    range: `${WATCHLIST_SHEET}!A${sheetRow}:N${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [updated] },
  });
}

export async function deleteMovie(imdbID) {
  const sheets = await getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId() });
  const sheetMeta = meta.data.sheets.find(
    (s) => s.properties.title === WATCHLIST_SHEET
  );
  if (!sheetMeta) return;

  const sheetRowIdx = await findRowIndex(sheets, WATCHLIST_SHEET, 0, imdbID);
  if (sheetRowIdx === -1) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId(),
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetMeta.properties.sheetId,
            dimension: "ROWS",
            startIndex: sheetRowIdx - 1, // 0-based
            endIndex: sheetRowIdx,
          },
        },
      }],
    },
  });
}

// ---------------------------------------------------------------------------
// Settings / Contributors
// ---------------------------------------------------------------------------

export async function getContributors() {
  const sheets = await getSheets();
  const rows = await ensureSheet(sheets, SETTINGS_SHEET, ST_COLS);
  return rows
    .filter((r) => r[0] === "contributor")
    .map((r) => r[1])
    .filter(Boolean);
}

export async function addContributor(name) {
  const sheets = await getSheets();
  await ensureSheet(sheets, SETTINGS_SHEET, ST_COLS);
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId(),
    range: `${SETTINGS_SHEET}!A:C`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [["contributor", name, new Date().toISOString().slice(0, 10)]],
    },
  });
}

export async function removeContributor(name) {
  const sheets = await getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId() });
  const sheetMeta = meta.data.sheets.find(
    (s) => s.properties.title === SETTINGS_SHEET
  );
  if (!sheetMeta) return;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId(),
    range: `${SETTINGS_SHEET}!A:B`,
  });
  const rows = res.data.values ?? [];
  // Find last matching contributor row (delete from bottom to keep indices stable)
  const matches = rows
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => r[0] === "contributor" && r[1] === name)
    .reverse();

  for (const { i } of matches) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId(),
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetMeta.properties.sheetId,
              dimension: "ROWS",
              startIndex: i,
              endIndex: i + 1,
            },
          },
        }],
      },
    });
  }
}
