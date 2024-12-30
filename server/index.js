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
            movies.push(row['Name']);
        })
        .on('end', () => {
            fs.unlink(filePath, (err) => {
                if(err){
                    console.error("Error: ", err);
                }
            })

            const random = movies[Math.floor(Math.random() * movies.length)]
            res.json({movie: random});
            console.log(random);
        })
        .on('error', (err) => {
            res.status(500).json({error: "Internal Server Error"});
        });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})