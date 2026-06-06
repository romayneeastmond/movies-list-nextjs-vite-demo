# Google Sheets Schema — Movies Watchlist

This workbook uses two sheets: **Watchlist** (one row per movie) and **Settings** (key-value configuration including contributors).

---

## Sheet 1: `Watchlist`

One row per movie.

| Column | Header | Type | Example | Notes |
|--------|--------|------|---------|-------|
| A | `imdbID` | Text | `tt0111161` / `tmdb-550` | Primary key. OMDB IDs are `tt`-prefixed; TMDB fallback IDs are `tmdb-` prefixed. |
| B | `Title` | Text | `The Shawshank Redemption` | Movie title as returned by the API. |
| C | `Year` | Text | `1994` | 4-digit release year. Stored as text to avoid date coercion. |
| D | `Poster` | Text (URL) | `https://m.media-amazon.com/...` | Full URL to poster image. `N/A` if unavailable. |
| E | `Genre` | Text | `Drama, Crime` | Comma-separated list of genres. |
| F | `Runtime` | Text | `142 min` | Runtime including unit suffix. |
| G | `Director` | Text | `Frank Darabont` | Primary director name. |
| H | `imdbRating` | Number | `9.3` | IMDb/TMDB vote average. Blank if unavailable. Format cell as `0.0`. |
| I | `Plot` | Text | `Two imprisoned men bond...` | Full plot synopsis. Set column to wrap text. |
| J | `Watched` | Boolean | `TRUE` / `FALSE` | Whether the watchlist has marked this as watched. |
| K | `DateAdded` | Date | `2026-06-06` | ISO 8601 date the movie was added. Format as `YYYY-MM-DD`. |
| L | `Source` | Text | `omdb` / `tmdb` | Which API the data was fetched from. |
| M | `AddedBy` | Text | `Alice` | Name of the contributor who added the movie. Optional. |

### Useful formulas

```
Total films:      =COUNTA(A2:A)
Watched count:    =COUNTIF(J2:J, TRUE)
Unwatched count:  =COUNTIF(J2:J, FALSE)
```

---

## Sheet 2: `Settings`

Key-value pairs for app configuration. One row per setting.

| Column | Header | Type | Example | Notes |
|--------|--------|------|---------|-------|
| A | `Key` | Text | `contributor` | Setting identifier. See valid keys below. |
| B | `Value` | Text | `Alice` | Setting value. |
| C | `UpdatedAt` | Date | `2026-06-06` | When this setting was last changed. |

### Valid Keys

| Key | Description | Example Value |
|-----|-------------|---------------|
| `contributor` | A person who contributes to the list. One row per person. | `Alice` |
| `list_title_override` | Optional fixed title. If blank, title is auto-generated from contributors. | `Family Watchlist` |

### How the title is derived

The app builds the watchlist title dynamically from `contributor` rows:

| Contributors | Resulting Title |
|--------------|-----------------|
| *(none)* | My Watchlist |
| Alice | Alice's Watchlist |
| Alice, Bob | Alice & Bob's Watchlist |
| Alice, Bob, Carol | Alice, Bob & Carol's Watchlist |

If `list_title_override` is set and non-empty, it takes precedence over the auto-generated title.

### Example Settings rows

| Key | Value | UpdatedAt |
|-----|-------|-----------|
| contributor | Alice | 2026-06-06 |
| contributor | Bob | 2026-06-06 |

---

## Notes

- **No separate Users sheet** — contributors are stored as repeating `contributor` rows in Settings, not a separate sheet. This keeps the schema simple for a small group.
- **`Watched` as Boolean** lets you use `COUNTIF` directly and apply conditional formatting (e.g. green fill for `TRUE` rows).
- **`imdbRating`** as a number enables sorting and averaging: `=AVERAGE(H2:H)`.
- **Poster URLs** may expire. For permanent storage, copy images to Google Drive and store the Drive share URL instead.
- **`AddedBy`** links a movie row back to a contributor name in Settings, making it possible to filter the watchlist by who added each film: `=FILTER(A2:M, M2:M="Alice")`.
