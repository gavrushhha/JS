import { config } from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import { Pool } from 'pg'
import { Server } from 'socket.io'
config()
// const express = require('express')
// const redis = require('redis')
// const bodyParser = require('body-parser')
// const http = require('http')
// const { Pool } = require('pg')
// const { Server } = require("socket.io")
// const app = express() 
// const server = http.createServer(app)


const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(`${__dirname}/public`))

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB
})

interface User {
  id: number
  full_name: string
  docs: number
}


app.get('/trains', (_, res) => {
  res.sendFile(`${__dirname}/public/train.html`)
})

app.get('/trains/all', async (_, res) =>{
  const query = 'select * from "user" order by id'
  const queryRes = await pool.query(query)

  res.json(queryRes.rows)
})

app.use(bodyParser.json())


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('user_update', async (user) => {
    console.log(`user_updated emited: user = `, user);

    const query = `
    update "user"
    set full_name = $1, docs = $2
    where id = $3
    returning id 
    `

    const queryRes = await pool.query(query, [user.full_name, user.docs, user.id])
    if (queryRes.rows.length > 0) io.emit('user_updated', user)
  });


  socket.on(`remove_user`, async id => {
    try{
    console.log(`remove_user emited: id = ${id}`)
    const query = `
    delete from "user"
    where id = $1
    returning id 
    `

    const queryRes = await pool.query(query, [id])
    if (queryRes.rows.length > 0) io.emit('user_removed', id)
  }catch (err){
    console.error(err)
  }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('user_add', async () => {
    try{
      console.log(`user_add emited`)

      const query = `
      insert into "user" (full_name)
      values ('')
      returning id 
      `

      const queryRes = await pool.query(query)

      if (queryRes.rows.length > 0)
        io.emit('user_added', queryRes.rows[0].id)
    }catch (err) {
      console.error(err)
    }
  })
})


const port = process.env.APP_PORT

server.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`)
  console.log(`equipment page - http://localhost:${port}/trains`)
});


