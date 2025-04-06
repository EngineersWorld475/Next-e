import { getMockPdfs, setMockPdfs } from "../../mockPdfs";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const id = searchParams.get("id");
  const authToken = req.headers.get("Authorization");

  if (!authToken) {
    return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "Missing collectionId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const currentPdfs = getMockPdfs();
  const updatedPdfs = currentPdfs.filter((pdf) => pdf.id !== id);
  setMockPdfs(updatedPdfs); 

  return new Response(JSON.stringify({ success: true, message: "Collection deleted successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
