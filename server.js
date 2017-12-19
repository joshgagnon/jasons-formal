const express = require('express');
const app = express();

app.use(express.static('public'))

app.listen(3453, () => console.log('App Started'));