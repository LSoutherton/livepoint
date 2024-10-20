const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors({origin: true}));
app.use(express.json());

const port = 4000;

app.post('/api/v1/saveFile', async (req, res) => {
    console.log(req.body.content);
    fs.writeFile('test.txt', req.body.content + ' Total Cost: ' + req.body.totalCost, err => {
        if (err) {
            console.log(err);
            return;
        }
    })

    res.status(200).json({
        status: 'success',
    })
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});