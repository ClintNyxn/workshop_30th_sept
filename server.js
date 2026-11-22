const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const path_to_db = path.join(__dirname, 'db.json')

app.use(express.json())

let cache = {}

const TTL = 60 * 1000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/product', (req, res) => {
  const key = req.url

  if (cache[key] && Date.now() < cache[key].expiry) {
    res.setHeader('X-Cache', 'HIT')
    return res.json(cache[key].data)
  }

  const read = fs.readFileSync(path_to_db, 'utf8')
  const products = JSON.parse(read)

  cache[key] = {
    data: products,
    expiry: Date.now() + TTL
  }

  res.setHeader('X-Cache', 'MISS')
  res.json(products)
})

app.get('/product/:id', (req, res) => {
  const key = req.url

  if (cache[key] && Date.now() < cache[key].expiry) {
    res.setHeader('X-Cache', 'HIT')
    return res.json(cache[key].data)
  }

  const read = fs.readFileSync(path_to_db, 'utf8')

  const product = JSON.parse(read)
    .find(i => i.id == req.params.id)

  if (!product) return res.status(404).send('Product not found')

  cache[key] = {
    data: product,
    expiry: Date.now() + TTL
  }

  res.setHeader('X-Cache', 'MISS')
  res.json(product)
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})