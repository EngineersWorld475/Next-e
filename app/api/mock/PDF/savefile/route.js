import { getMockPdfs, setMockPdfs } from "../../mockPdfs";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const article = formData.get('article');
    const pubmedid = formData.get('pubmedid');
    const author = formData.get('author');
    const doi = formData.get('doi');
    const userId = formData.get('userId');
    const pdfFile = formData.get('url');

    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      return Response.json({ success: false, message: 'Invalid PDF file' }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate file URL
    const fakeUrl = `http://localhost:3000/mock-pdfs/${Date.now()}-${pdfFile.name}`;

    const newPdf = {
      id: Date.now().toString(),
      article,
      pubmedid,
      author,
      doi,
      userId,
      pdfFile: fakeUrl,
      createdAt: new Date().toISOString(),
    };

    const currentPdfs = getMockPdfs();
    setMockPdfs([...currentPdfs, newPdf]);

    return Response.json({ success: true, fileUpload: true, data: newPdf });
  } catch (error) {
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
