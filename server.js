const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

path_to_db = path.join(__dirname,'db.json')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/product',(req,res)=>{
  const read = fs.readFileSync(path_to_db,'utf8')
  const r = JSON.parse(read)
  res.status(200).send(r)
})

app.get('/product/:id',(req,res)=>{
  const read = fs.readFileSync(path_to_db,'utf8')
  const r = JSON.parse(read)
    .find(i => i.id == req.params.id)
  res.status(200).send(r)
})

app.listen('3000')
