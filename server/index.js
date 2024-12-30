const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { error } = require('console');

const app = express();
const upload = multer({dest : 'uploads/'})

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const movies = [];

    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
            movies.push([row['Name'], row['Letterboxd URI']]);
            console.log(movies);
        })
        .on('end', () => {
            fs.unlink(filePath, (err) => {
                if(err){
                    console.error("Error: ", err);
                }
            })

            const random = movies[Math.floor(Math.random() * movies.length)]
            res.json({movie: random[0], link: random[1]});
            console.log(random[0], random[1]);
        })
        .on('error', (err) => {
            res.status(500).json({error: err.message});
        });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})