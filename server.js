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

const ListingsDB = require("./modules/listingsDB.js"); 
const db = new ListingsDB(); // Create a new instance of ListingsDB

const path = require('path');
const app = express();

app.use(cors());
//support for incoming JSON entities.
app.use(express.json());

const mongoURI = process.env.MONGODB_CONN_STRING;

// Initialize the database and start the server
db.initialize(mongoURI)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
  });


// create a GET route to check if the server is up and running
app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
  });
  
// POST: Add new Listing document to the collection.
// This route returns the newly created listing object or a fail message to the client
app.post("/api/listings", (req, res) => {
    db.addNewListing(req.body)
    .then(newListing => {
      res.status(201).json(newListing);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// GET: /api/listings
app.get("/api/listings", (req, res) => {
  const { page = 1, perPage = 10, name = '' } = req.query;
  db.getAllListings(Number(page), Number(perPage), name) 
    .then(listings => {
      res.status(200).json(listings); 
    })
    .catch(err => {
      res.status(500).json({ error: err.message }); 
    });
});

// GET: /api/listings/:id
app.get('/api/listings/:id', (req, res) => {
    // Endpoint to retrieve a single listing by its ID
    const { id } = req.params; // Extract the ID from the URL parameters
    db.getListingById(id) // Use the getListingById method from ListingsDB
      .then(listing => {
        if (listing) {
          res.status(200).json(listing); // Respond with status 200 and the listing if found
        } else {
          res.status(404).json({ message: 'Listing not found' }); // Respond with status 404 if listing not found
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message }); // Respond with status 500 if an error occurs
      });
  });
  
  // PUT: /api/listings/:id
  app.put('/api/listings/:id', (req, res) => {
    // Endpoint to update an existing listing by its ID
    const { id } = req.params; // Extract the ID from the URL parameters
    const data = req.body; // Extract the update data from the request body
    db.updateListingById(data, id) // Use the updateListingById method from ListingsDB
      .then(result => {
        if (result.nModified > 0) {
          res.status(200).json(result); // Respond with status 200 if the update was successful
        } else {
          res.status(404).json({ message: 'Listing not found or no changes made' }); // Respond with status 404 if no changes were made
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message }); // Respond with status 500 if an error occurs
      });
  });
  
  // DELETE: /api/listings/:id
  app.delete('/api/listings/:id', (req, res) => {
    // Endpoint to delete an existing listing by its ID
    const { id } = req.params; // Extract the ID from the URL parameters
    db.deleteListingById(id) // Use the deleteListingById method from ListingsDB
      .then(result => {
        if (result.deletedCount > 0) {
          res.status(204).send(); // Respond with status 204 if the deletion was successful
        } else {
          res.status(404).json({ message: 'Listing not found' }); // Respond with status 404 if the listing was not found
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message }); // Respond with status 500 if an error occurs
      });
  });