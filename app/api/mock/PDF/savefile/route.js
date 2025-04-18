import { getMockPdfs, setMockPdfs } from "../../mockPdfs";
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const article = formData.get('article');
    const pubmedid = formData.get('pubmedid');
    const author = formData.get('author');
    const doi = formData.get('doi');
    const userId = formData.get('userId');
    const url = formData.get('url');
    const pdfFile = formData.get('file');

    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      return Response.json({ success: false, message: 'Invalid PDF file' }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Convert the uploaded file to a buffer
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const filename = `${Date.now()}-${pdfFile.name}`;

    // Define where to save the file (public/uploads)
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    // Save the file to your local disk
    fs.writeFileSync(filePath, buffer);

    // Real URL to access the uploaded PDF
    const realUrl = `/uploads/${filename}`;

    const newPdf = {
      id: Date.now().toString(),
      article,
      pubmedid,
      author,
      doi,
      userId,
      pdfFile: realUrl,
      createdAt: new Date().toISOString(),
    };

    const currentPdfs = getMockPdfs();
    setMockPdfs([...currentPdfs, newPdf]);

    return Response.json({ success: true, fileUpload: true, data: newPdf });
  } catch (error) {
    console.log('...savefile error',error)
    return Response.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
