import { getMockPdfs, setMockPdfs } from "../../mockPdfs";

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
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

    const body = await req.json();
    const { id, article, pubmedid, author, doi } = body;

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: "Missing collection ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentPdfs = getMockPdfs();
    const index = currentPdfs.findIndex((pdf) => pdf.id === id && pdf.userId === userId);

    if (index === -1) {
      return new Response(JSON.stringify({ success: false, message: "Collection not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    currentPdfs[index] = {
      ...currentPdfs[index],
      article,
      pubmedid,
      author,
      doi,
    };

    setMockPdfs(currentPdfs);
    return new Response(JSON.stringify({ success: true, data: currentPdfs[index] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log('...error', error)
    return new Response(JSON.stringify({ success: false, message: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
