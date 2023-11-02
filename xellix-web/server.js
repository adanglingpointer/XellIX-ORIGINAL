const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

//  serve index.html for any unknown paths,
//  ie for the case of localhost:3000/todos/42
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
