const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/browse-directory', (req, res) => {
  const directoryPath = req.query.path || __dirname;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }

    const fileDetails = files.map((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      return {
        name: file,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        lastModified: stats.mtime,
      };
    });

    res.json({ directory: directoryPath, files: fileDetails });
  });
});

module.exports = router;
