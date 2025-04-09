import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mockPdfs.json');

function getMockPdfs() {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error("Error reading mockPdfs file:", error);
    return [];
  }
}

function setMockPdfs(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing mockPdfs file:", error);
  }
}

export { getMockPdfs, setMockPdfs };
