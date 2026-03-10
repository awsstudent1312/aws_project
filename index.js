const express = require('express');

const app = express();

app.get('/',async (req,res) => {
    res.send("<h1>Hello In My tweeter</h1>");
});

app.listen(3000);
