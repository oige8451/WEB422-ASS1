/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 1
* Student Name: Tomi Ige
* Student Email: ooige1@myseneca.ca
* Course/Section: WEB422/ZAA
* Cyclic URL: 
*
*****************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); 
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors());

//support for incoming JSON entities.
app.use(express.json());


// create a GET route to check if the server is up and running
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
  });
  
  // start the server
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
  });
