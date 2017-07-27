const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, './public')));

app.listen(app.get('port'));
console.log('listening at port' +  app.get('port'));

module.exports = app;
