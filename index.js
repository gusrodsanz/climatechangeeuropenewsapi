const PORT = process.env.PORT || 8000  // to deploy in HEROKU
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: '' //https://www.thetimes.co.uk'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '' //https://www.theguardian.com'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    }
]

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })


        }).catch((err) => console.log(err))
})

app.get('/', (req, res) => {
    res.json('Welcome to this climate change API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId',   (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data

            const $ = cheerio.load(html)

            const specificArticle = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificArticle.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(articles)

        }).catch(err => console.log(err))

})


app.listen(PORT, () => console.log(` SEVER RUNNING ON PORT ${PORT} `))
