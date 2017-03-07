'use strict'

const express = require('express');
const bodyParser = require('body-parser');
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
  res.send('Starting process')
  console.log('Cloning...');
  exec('git config --global user.email "bot@unfoldingWord-dev.org"');
  exec('git config --global user.name "translationCore Updater"');
  exec('git clone --recursive ' + mainRepo + ' translationCore',  (err, data) => {
    console.log(err || data);
    console.log('Updating...');
    exec('npm run pull-apps', {cwd: './translationCore'}, (err, data) => {
      if (err) {
        console.log(err);
        fs.removeSync('./translationCore');
        return;
      }
      console.log(data);
      console.log('Committing...');
      exec('git commit -a -m"Update repos via translationCore Submodule Updater"', {cwd: './translationCore'}, (err, data) => {
        if (err) {
          console.log(err);
          fs.removeSync('./translationCore');
          return;
        }
        console.log(data);
        var token = process.env.token;
        var remote = 'https://' + token + '@github.com/unfoldingWord-dev/translationCore.git develop';
        console.log('Pushing...');
        exec('git push ' + remote, {cwd: './translationCore'}, (err, data) => {
          console.log(data);
          console.log(err || "Succesfully updated");
          fs.removeSync('./translationCore');
          return;
        })
      });
    });
  });
});

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
