const OMDB_KEY = process.env.OMDB_KEY;
const TMDB_KEY = process.env.TMDB_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  if (id.startsWith("tmdb-")) {
    const tmdbId = id.replace("tmdb-", "");
    const [detailRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=${TMDB_KEY}`),
    ]);
    const detail = await detailRes.json();
    const credits = await creditsRes.json();
    const director = credits.crew?.find((c) => c.job === "Director")?.name || "N/A";

    return Response.json({
      imdbID: id,
      Title: detail.title,
      Year: detail.release_date?.slice(0, 4) || "N/A",
      Poster: detail.poster_path ? `${TMDB_IMG}${detail.poster_path}` : "N/A",
      Genre: detail.genres?.map((g) => g.name).join(", ") || "N/A",
      Runtime: detail.runtime ? `${detail.runtime} min` : "N/A",
      Director: director,
      imdbRating: detail.vote_average ? detail.vote_average.toFixed(1) : "N/A",
      Plot: detail.overview || "N/A",
    });
  }

  // OMDB
  const res = await fetch(
    `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${OMDB_KEY}`
  );
  const data = await res.json();
  if (data.Response !== "True") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(data);
}
