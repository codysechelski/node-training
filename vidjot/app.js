const express        = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const bodyparser     = require('body-parser');
const mongoose       = require('mongoose');

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

//Method Override Middleware
app.use(methodOverride('_method'));

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

//idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//Add Idea Route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Route
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render('ideas/edit', {
        idea: idea
      });
    });
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
    const newUser = {
      title  : req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      });
  }
});

//Edit Form Process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;  

    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      });
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});