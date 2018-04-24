const express    = require('express');
const exphbs     = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose   = require('mongoose');

const app = express();

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/my_database')
  .then(() => console.log('db connected'))
  .catch(err => console.log(`Error Connecting to Mongoose: ${err}`));

//Load Idea Schema
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(bodyparser.json());

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

//Add Idea Route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//process form
app.post('/ideas', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text     : 'Please enter a title',
      controlId: 'title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text     : 'Please enter the details',
      controlId: 'details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors : errors,
      title  : req.body.title,
      details: req.body.details
    });
  } else {
    res.send('passed');
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});