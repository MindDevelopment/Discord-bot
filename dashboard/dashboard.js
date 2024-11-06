const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Welkom op het dashboard van je Discord bot!');
});

app.listen(port, () => {
    console.log(`Dashboard bereikbaar op http://localhost:${port}`);
});
