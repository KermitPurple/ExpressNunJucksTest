require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const {Octokit} = require('@octokit/core');
const octokit = new Octokit({auth: process.env.AUTH});
let app = express();
const PORT = 5000;
const STATIC_DIR = path.join(__dirname, 'static');

let github_api_data = { 
        public_repos: 0,
        private_repos: 0,
        link: '#',
        language_data: {},
}

nunjucks.configure('static/html', {
    autoescape: true,
    express: app,
});

app.use(express.static(STATIC_DIR));

app.get('/', async(req, res)=>{
    res.render('index.html', github_api_data);
});

app.listen(PORT, ()=>{
    console.log(`Listening on http:/localhost:${PORT}`);
});

async function get_githup_api_data(){
    let language_data = {};
    let highest_language_value = 0;
    const user = await octokit.request('GET /user');
    let repos = [];
    for(let i = 1;; i++){
        const repo_page = await octokit.request(`GET /search/repositories?q=user:${user.data.login}&per_page=100&page=${i}`);
        if(repo_page.data.items.length === 0)
            break;
        repos = repos.concat(repo_page.data.items);
    }
    for(let i = 0; i < repos.length; i++){
        const languages = await octokit.request(`GET /repos/${user.data.login}/${repos[i].name}/languages`);
        for(language in languages.data){
            if(language in language_data)
                language_data[language] += languages.data[language];
            else
                language_data[language] = languages.data[language];
            highest_language_value = Math.max(language_data[language], highest_language_value);
        }
    }
    github_api_data.public_repos = user.data.public_repos;
    github_api_data.private_repos = user.data.total_private_repos;
    github_api_data.link = user.data.url;
    github_api_data.language_data = language_data;
    github_api_data.highest_language_value = highest_language_value;
    console.log('updated github_api_data');
    setTimeout(get_githup_api_data, 3600000);
}
get_githup_api_data();
