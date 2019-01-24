const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const path = require('path');
const axios = require('axios')
const cheerio = require('cheerio')

mongoose.connect('mongodb://localhost/nytdb', {
    useNewUrlParser: true
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.get('/titles', (req, res) => {
    axios.get('https://www.nytimes.com/')
        .then(r => {
            const $ = cheerio.load(r.data)
            nytTitle = [];
            $('a').each((i, elem) => {
                if ($(elem).children().children('h2.esl82me2').text() !== '') {
                    nytTitle.push({
                        title: $(elem).children().children('h2.esl82me2').text()
                    })
                }
            })
            Nyt.create(nytTitle)
            res.json(nytTitle)
        })
        .catch(e => console.log(e))
})
const Schema = mongoose.Schema;

const nytSchema = new Schema({
    title: String
})

const Nyt = mongoose.model('Nyt', nytSchema)

app.listen(3000, _ => console.log('http://localhost:3000'));