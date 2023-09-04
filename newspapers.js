const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'elcomercio',
        address: 'https://elcomercio.pe/tecnologia',
        base: 'https://elcomercio.pe'
    },
    {
        name: 'rpp',
        address: 'https://rpp.pe/tecno',
        base: ''
    }/*,
    {
        name: 'larepublica',
        address: 'https://larepublica.pe/tecnologia',
        base: 'https://larepublica.pe'
    }*/
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("ChatGPT")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
        .catch(err => console.log(err))
})

app.get('/', (req, res) => {
    res.json('Welcome to my Technology News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)
    const newspaperAddress = newspaper[0].address
    const newspaperBase = newspaper[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            // const c = $('a').contents()
            // console.log('a.contents() ', c.length)

            // const a = $('a').filter(".story-item__title", html)
            // console.log('a.filter("ChatGPT") ', a.length)

            // const b = $('a:contains("ChatGPT")')
            // console.log('a:contains("ChatGPT")', b.length)

            $('a:contains("ChatGPT")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                // console.log("titulo: ", title)
                // console.log("url: ", url)

                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        })
        .catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
