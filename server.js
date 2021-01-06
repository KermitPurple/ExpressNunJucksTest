const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
let app = express();
const PORT = 5000
const STATIC_DIR = path.join(__dirname, 'static')

nunjucks.configure('static/html', {
    autoescape: true,
    express: app,
});

app.use(express.static(STATIC_DIR));

app.get('/', (req, res)=>{
    res.render('index.html');
});

app.listen(PORT, ()=>{
    console.log(`Listening on http:/localhost:${PORT}`);
});


