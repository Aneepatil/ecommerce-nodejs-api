import http from 'http'
import { app } from './app/app.js'
import dotenv from 'dotenv'
dotenv.config()


const PORT = process.env.PORT || 4000
const server = http.createServer(app)

server.listen(PORT, console.log(`Server is running on port number ${PORT}...`))