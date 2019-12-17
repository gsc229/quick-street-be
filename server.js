const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' })

const server = express();

server.use(express.json());

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`\n *** LISTENING ON PORT ${PORT} ***\n`.yellow.bold));