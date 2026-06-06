import { getWatchlist, appendMovie, updateMovie, deleteMovie } from "@/lib/sheets";

export async function GET() {
  try {
    const rows = await getWatchlist();
    return Response.json({ ok: true, data: rows });
  } catch (err) {
    console.error("[GET /api/watchlist]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const movie = await request.json();
    await appendMovie(movie);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/watchlist]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { imdbID, ...changes } = await request.json();
    await updateMovie(imdbID, changes);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/watchlist]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await deleteMovie(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/watchlist]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
