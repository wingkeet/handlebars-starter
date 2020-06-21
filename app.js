'use strict'

const express = require('express')
const handlebars  = require('express-handlebars')
const fs = require('fs').promises
const path = require('path')
const util = require('util')

const app = express()
const hostname = '0.0.0.0'
const port = 3000

app.set('view engine', 'hbs')
app.engine('hbs', handlebars({
    extname: 'hbs'
}))

app.use(express.json())
app.use(express.static('public'))

// curl http://localhost:3000/healthcheck
app.get('/healthcheck', (req, res) => {
    res.json({ ok: 1, date: new Date(), nv: process.version, mem: process.memoryUsage() })
})

// curl http://localhost:3000
app.get('/', (req, res, next) => {
    try {
        let healthcheck = { ok: 1, date: new Date(), nv: process.version, mem: process.memoryUsage() }
        healthcheck = util.inspect(healthcheck, { depth: null })
        res.render('home', { healthcheck })
    }
    catch (err) {
        next(err)
    }
})

// curl -H "content-type: application/json" -d "@data.json" -i http://localhost:3000
app.post('/', (req, res, next) => {
    try {
        const username = req.body.username
        if (username === undefined) {
            res.status(400).end()
            return
        }
        res.json({ ok: 1, username, date: new Date() })
    }
    catch (err) {
        next(err)
    }
})

// Error handling middleware must be defined last
// https://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.stack)
})

app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port} at ${new Date()}`)
})
