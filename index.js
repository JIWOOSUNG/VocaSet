const express = require('express');
require('dotenv').config();

// env
const host = process.env.HOST;
const port = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log('Server Connected: http://' + host + ':' + port);
});
