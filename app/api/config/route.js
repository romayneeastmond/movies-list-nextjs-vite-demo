export async function GET() {
	return Response.json({
		enableTorrents: process.env.ENABLE_TORRENTS === "true",
	});
}
