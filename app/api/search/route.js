const OMDB_KEY = process.env.OMDB_KEY;
const TMDB_KEY = process.env.TMDB_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return Response.json({ results: [] });

  // Try OMDB first
  const omdbRes = await fetch(
    `https://www.omdbapi.com/?s=${encodeURIComponent(q)}&type=movie&apikey=${OMDB_KEY}`
  );
  const omdbData = await omdbRes.json();

  if (omdbData.Search?.length) {
    return Response.json({ results: omdbData.Search });
  }

  // Fall back to TMDB
  const tmdbRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&include_adult=false`
  );
  const tmdbData = await tmdbRes.json();

  const results = (tmdbData.results || []).slice(0, 8).map((m) => ({
    imdbID: `tmdb-${m.id}`,
    Title: m.title,
    Year: m.release_date?.slice(0, 4) || "N/A",
    Poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : "N/A",
    _source: "tmdb",
  }));

  return Response.json({ results });
}
