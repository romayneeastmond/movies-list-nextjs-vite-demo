import { getContributors, addContributor, removeContributor } from "@/lib/sheets";

export async function GET() {
  try {
    const contributors = await getContributors();
    return Response.json({ ok: true, contributors });
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    await addContributor(name);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/settings]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { name } = await request.json();
    await removeContributor(name);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/settings]", err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
