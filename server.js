import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static assets EXCEPT index.html
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Serve the dynamically injected index.html for all routes (React Router)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html', err);
      return res.status(500).end();
    }

    // Read the API key from Cloud Run's runtime environment variables
    const apiKey = process.env.VITE_GEMINI_API_KEY || '';
    
    // Inject the API key into the placeholder in index.html
    const injectedHtml = htmlData.replace('__GEMINI_API_KEY__', apiKey);
    
    res.send(injectedHtml);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
