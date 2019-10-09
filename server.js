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
      response.status(404).json({ error });
    });
});

app.get('/api/v1/patrons/:id', (request, response) => {
  database('patrons').where('id', request.params.id).select()
    .then(patrons => {
      if (patrons.length) {
        response.status(200).json(patrons);
      } else {
        response.status(404).json({ 
          error: `We could not find patron based on the id provided (${request.params.id})`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/library_loans', (request, response) => {
  database('library_loans').select()
    .then(loans => {
      response.status(200).json(loans);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

app.get('/api/v1/library_loans/:id', (request, response) => {
  database('library_loans').where('id', request.params.id).select()
    .then(loans => {
      if (loans.length) {
        response.status(200).json(loans);
      } else {
        response.status(404).json({ 
          error: `We could not find the loaned item based on the id provided (${request.params.id})`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/patrons', (request, response) => {
  const patron = request.body;

  for (let requiredParameter of ['first_name', 'last_name', 'email', 'address', 'phone_number', 'overdue_fees']) {
    if (!patron[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { 'first_name': <String>, 'last_name': <String>, 'email': <String>, 'address': <String>, 'phone_number': <String>, 'overdue_fees': <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('patrons').insert(patron, 'id')
    .then(patron => {
      response.status(201).json({ id: patron[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/library_loans', (request, response) => {
  const loan = request.body;

  for (let requiredParameter of ['title', 'author', 'ISBN', 'overdue']) {
    if (!loan[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { 'title': <String>, 'author': <String>, 'ISBN': <String>, 'overdue': <Boolean> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('library_loans').insert(loan, 'id')
    .then(loan => {
      response.status(201).json({ id: loan[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});