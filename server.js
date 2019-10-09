const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Library Patron Data';

app.get('/', (request, response) => {
  response.send('Loading Library Patrons');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});