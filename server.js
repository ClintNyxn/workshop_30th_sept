const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

path_to_db = path.join(__dirname,'db.json')

// promise stuff

// new Promise(rej,res)=>{setTimeout(()=>resolve,1500)}


// async function readFileWithDelay(){
//  setTimeout(() => {
//    const read = await fs.readFile(path_to_db,'utf8')
//    console.log(read)
//  }, 1500); 
// }

cache = {
  /product : products, // whenever a post req is successfully made, we should change this to latest value, 
  // /product/1 : products[0]
  
  // try time-to-live to invalidating this.
  // read the doc on slack, 
  // learn about response for setheader cache 
  // learn about cache-hit and cache-miss
} // what is the structure here ??

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/product',async(req,res)=>{
  
  let key = req.url
  let value = cache[key]

  if (value) return res.json(value)

  const read = fs.readFileSync(path_to_db,'utf8')
  res.status(200).send(JSON.parse(read))
})

app.get('/product/:id',async(req,res)=>{
  const read = fs.readFileSync(path_to_db,'utf8')
  const product = JSON.parse(read)
    .find(i => i.id == req.params.id)
  res.status(200).send(product)
})

app.listen('3000')
