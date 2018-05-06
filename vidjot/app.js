const express        = require('express');
const path           = require('path');
const exphbs         = require('express-handlebars');
const methodOverride = require('method-override');
const flash          = require('connect-flash');
const session        = require('express-session');
const bodyParser     = require('body-parser');
const passport       = require('passport');
const mongoose       = require('mongoose');

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev')
  .then(() => console.log('db connected'))
  .catch(err => console.log(`Error Connecting to Mongoose: ${err}`));

//handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method Override Middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Passport MMiddleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
app.use(flash());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});