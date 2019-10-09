const express = require('express');
const app = express();
const cors = require('cors');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Library Patron Data';

app.get('/', (request, response) => {
  response.send('Loading Library Patrons');
});

app.get('/api/v1/patrons', (request, response) => {
  database('patrons').select()
    .then(patrons => {
      response.status(200).json(patrons);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/patrons/:id', (request, response) => {
  database('patrons').where('id', request.params.id).select()
    .then(patrons => {
      if (patrons.length) {
        response.status(200).json(patrons);
      } else {
        response.status(404).json({ 
          error: `Could not find patron based on the id provided (${request.params.id})`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});