const express  = require('express');
const exphbs   = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//connect to mongoose
//mongoose.connect('mongodb://localhost:5001/vidjot-dev', {
//  useMongoClient: true
//})
mongoose.connect('mongodb://localhost/my_database')
  .then(() => console.log('db connected'))
  .catch(err => console.log(`Error Connecting to Mongoose: ${err}`));

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Contact Route
app.get('/contact', (req, res) => {
  res.render('contact');
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});