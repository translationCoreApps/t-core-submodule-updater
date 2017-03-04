'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs-extra');
const exec = require('child_process').exec;
const mainRepo = "https://github.com/unfoldingWord-dev/translationCore.git";

app.set('port', (process.env.PORT || 8000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
  exec('git clone ' + mainRepo + ' translationCore',  (err, data) => {
    if (err) {
      console.log(err);
      res.send(err)
      fs.removeSync('./translationCore');
      return;
    }
    exec('npm run pull-apps', {cwd: './translationCore'}, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err)
        fs.removeSync('./translationCore');
        return;
      }
      exec('git commit -a -m"Update repos via translationCore Submodule Updater"', {cwd: './translationCore'}, (err, data) => {
        console.log(err || "Succesfully updated");
        res.send(err, data);
        fs.removeSync('./translationCore');
        return;
      });
    });
  });
});

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
