require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const {Octokit} = require('@octokit/core');
const octokit = new Octokit({auth: process.env.AUTH});
let app = express();
const PORT = 5000
const STATIC_DIR = path.join(__dirname, 'static')

nunjucks.configure('static/html', {
    autoescape: true,
    express: app,
});

app.use(express.static(STATIC_DIR));

app.get('/', async(req, res)=>{
    const response = await octokit.request('GET /user');
    console.log(response);
    res.render('index.html');
});

app.listen(PORT, ()=>{
    console.log(`Listening on http:/localhost:${PORT}`);
});


