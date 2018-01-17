const express = require('express');
const app = express();

app.use(express.static('public'));

app.post('/api/render', function (req, res) {
  res.send('hello world')
})

app.listen(3453, () => console.log('App Started'));