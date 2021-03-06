const express  = require('express');
const mongoose = require('mongoose');
const router   = express.Router();

//Load Idea Schema
require('../models/Idea');
const Idea = mongoose.model('ideas');

//idea index page
router.get('/', (req, res) => {
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
router.get('/add', (req, res) => {
  res.render('ideas/add');
});

//Edit Idea Route
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res) => {
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
        req.flash('success_msg', 'Idea Added')
        res.redirect('/ideas');
      });
  }
})

//Edit Form Process
router.put('/:id', (req, res) => {
  Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      idea.title   = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Idea Updates')
          res.redirect('/ideas');
        });
    });
});

//Delete Idea Route
router.delete('/:id', (req, res) => {
  Idea.remove({
      _id: req.params.id
    })
    .then(() => {
      req.flash('success_msg', 'Idea Removed')
      res.redirect('/ideas');
    });
});

module.exports = router;