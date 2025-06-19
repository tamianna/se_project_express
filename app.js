const express = require('express');
const app = express();

const { PORT = 3001 } = process.env;

//app.get('/', (req, res) => {
//  res.send('Hello from Express!');
//});

app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});