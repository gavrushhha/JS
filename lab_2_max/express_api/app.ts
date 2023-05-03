import { config } from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import { Pool } from 'pg'
import { Server } from 'socket.io'
config()

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

interface Car {
  id: number
  brand: string
  model: string
  color: string
  number: string
}


app.get('/cars', (_, res) => {
  res.sendFile(`${__dirname}/public/train.html`)
})

app.get('/cars/all', async (_, res) =>{
  const query = 'select * from car order by id'
  const queryRes = await pool.query<Car>(query)

  res.json(queryRes.rows)
})

app.use(bodyParser.json())


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('car_update', async (car: Car) => {
    console.log(`car_updated emited: car = `, car);

    const query = `
    update car
    set brand = $1, color = $2
    where id = $3
    returning id 
    `

    const queryRes = await pool.query<{id: number}>(query, [car.id, car.brand, car.model, car.color, car.number])
    if (queryRes.rows.length > 0) io.emit('car_updated', car)
  });


  socket.on(`remove_car`, async id => {
    try{
    console.log(`remove_car emited: id = ${id}`)
    const query = `
    delete from car
    where id = $1
    returning id 
    `

    const queryRes = await pool.query<{id: number}>(query, [id])
    if (queryRes.rows.length > 0) io.emit('car_removed', id)
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

  socket.on('car_add', async () => {
    try{
      console.log(`car_add emited`)

      const query = `
      insert into car (brand, model, color, number)
      values ('', '', '', '')
      returning id 
      `

      const queryRes = await pool.query<{id: number}>(query)

      if (queryRes.rows.length > 0)
        io.emit('car_added', queryRes.rows[0].id)
    }catch (err) {
      console.error(err)
    }
  })
})


const port = process.env.APP_PORT

server.listen(port, () => {
  console.log(`app listening on http://localhost:${port}/`)
  console.log(`car page - http://localhost:${port}/cars`)
});


