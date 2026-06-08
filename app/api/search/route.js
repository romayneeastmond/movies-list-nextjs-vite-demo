const OMDB_KEY = process.env.OMDB_KEY;
const TMDB_KEY = process.env.TMDB_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return Response.json({ results: [] });

  const enc = encodeURIComponent(q);

  // Search OMDB movies and TMDB TV shows in parallel
  const [omdbRes, tmdbTVRes] = await Promise.all([
    fetch(`https://www.omdbapi.com/?s=${enc}&type=movie&apikey=${OMDB_KEY}`),
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${enc}&include_adult=false`),
  ]);
  const [omdbData, tmdbTVData] = await Promise.all([omdbRes.json(), tmdbTVRes.json()]);

  const tvResults = (tmdbTVData.results || []).slice(0, 4).map((s) => ({
    imdbID: `tvdb-${s.id}`,
    Title: s.name,
    Year: s.first_air_date?.slice(0, 4) || "N/A",
    Poster: s.poster_path ? `${TMDB_IMG}${s.poster_path}` : "N/A",
    _type: "tv",
  }));

  if (omdbData.Search?.length) {
    return Response.json({ results: [...omdbData.Search, ...tvResults] });
  }

  // Fall back to TMDB movies
  const tmdbMovieRes = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${enc}&include_adult=false`
  );
  const tmdbMovieData = await tmdbMovieRes.json();

  const movieResults = (tmdbMovieData.results || []).slice(0, 5).map((m) => ({
    imdbID: `tmdb-${m.id}`,
    Title: m.title,
    Year: m.release_date?.slice(0, 4) || "N/A",
    Poster: m.poster_path ? `${TMDB_IMG}${m.poster_path}` : "N/A",
    _source: "tmdb",
  }));

  return Response.json({ results: [...movieResults, ...tvResults] });
}
