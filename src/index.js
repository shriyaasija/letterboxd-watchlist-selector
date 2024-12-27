const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const upload = multer({dest: 'uploads/'});

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const movies = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      movies.push(row['Name']);
    })
    .on('end', () => {
      fs.unlink(filePath, (err) => {
        if(err){
          console.log("File deletion error: ", err);
        }
      });

      if(movies.length === 0){
        return(res.status(400).json({error: "Watchlist is empty"}));
      }

      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      res.json({movie: randomMovie});
    })

    .on('error', (err) => {
      if(err){
        res.status(500).json({error: 'Failed to process file'});
      }
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})