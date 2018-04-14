var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'home' });
});

router.post('/', (req, res, next) => {
  const email = req.body.email;
  const data = fs.readFileSync(path.join(__dirname, '..', '/db/db.json'));
  const db = JSON.parse(data);
  const emailRecord = db.find(value => value.email == email);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lapvv62@wru.vn',
      pass: 'lapdeptrai123'
    }
  });
  var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  var mailOptions = {
    from: 'lapvv62@wru.vn',
    to: email,
    subject: 'active email',
    html: '<a href="http://localhost:3000/activation/' + token + '">link here</a>'
  };
  if (emailRecord) {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/email/' + email)
      }
    });
  } else {
    const newEmail = {
      "email": email,
      "status": "not active"
    }
    db.push(newEmail);
    fs.writeFileSync(path.join(__dirname, '..', '/db/db.json'), JSON.stringify(db));
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/email/' + email)
      }
    });
  }
})


module.exports = router;
