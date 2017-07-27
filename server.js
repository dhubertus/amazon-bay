const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require(path.join(__dirname, './knexfile.js'))[environment];
const database = require('knex')(configuration);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, './public')));

app.get('/api/v1/inventory', (req, res) => {
  database('inventory').select()
    .then((inventory) => {
      if (inventory.length) {
        res.status(200).json(inventory);
      } else {
        res.status(404).json({ error: 'There was nothing in inventory!' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.get('/api/v1/history', (req, res) => {
  database('history').select()
    .then((history) => {
      if (history.length) {
        res.status(200).json(history);
      } else {
        res.status(404).json({ error: 'There was nothing in history!' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.post('/api/v1/history', (req, res) => {
  database('history')
    .insert({
      total: req.body.total
    })
    .then((result) => {
      if (req.body.total) {
        res.status(200).json(result);
      } else {
        res.status(422).json({ error: 'There was an error inserting to history. Please check that you are including the proper body with the request!' });
      }
    });
});

app.listen(app.get('port'));
console.log('listening at port' +  app.get('port'));

module.exports = app;
