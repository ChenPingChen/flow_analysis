const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());

app.post('/api/save-config', async (req, res) => {
  try {
    const { config } = req.body;
    await fs.writeFile(
      path.join(__dirname, '../../config.yaml'),
      config,
      'utf8'
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving config:', error);
    res.status(500).json({ error: 'Failed to save config' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
}); 