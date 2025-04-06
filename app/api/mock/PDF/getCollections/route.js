import { getMockPdfs } from "../../mockPdfs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const authToken = req.headers.get("Authorization");

  if (!authToken) {
    return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!userId) {
    return Response.json({ success: false, message: 'Missing userId' }, { status: 400 });
  }

  const mockPdfs = getMockPdfs();
  const userPdfs = mockPdfs.filter(pdf => pdf.userId === userId);

  return Response.json({ success: true, data: userPdfs });
}
