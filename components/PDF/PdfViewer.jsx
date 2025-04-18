'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { v4 as uuid } from 'uuid';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ pdfId }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [showBox, setShowBox] = useState(false);

  // Fetch PDF info (mock or real)
  useEffect(() => {
    // Simulate fetch
    const fetchPdfUrl = async () => {
      // In real project: use fetch or Redux or any API call
      // Example:
      // const res = await axios.get(`/api/pdf/${pdfId}`);
      // setPdfUrl(res.data.pdf);

      // Simulated for now
      const fakePdf = 'https://example.com/path/to/pdf.pdf'; // Replace with real logic
      setPdfUrl(fakePdf);
    };

    fetchPdfUrl();
  }, [pdfId]);

  // Text selection
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        setSelectedText(selection);
        setShowBox(true);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleSubmit = () => {
    const data = {
      id: uuid(),
      pdfId,
      selectedText,
      question,
    };
    console.log('Submitted Question:', data);
    setShowBox(false);
    setQuestion('');
    setSelectedText('');
  };

  return (
    <div className="relative h-screen">
      {pdfUrl && (
        <Document file={pdfUrl}>
          <Page pageNumber={1} />
        </Document>
      )}

      {showBox && (
        <div className="fixed bottom-6 left-6 p-4 bg-white border shadow-md rounded w-96 z-50">
          <p className="mb-2 text-sm text-gray-700 font-medium">
            Selected: <i>{selectedText}</i>
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded text-sm mb-2"
            placeholder="Ask your question here..."
          />
          <Button onClick={handleSubmit}>Submit Question</Button>
        </div>
      )}
    </div>
  );
}
