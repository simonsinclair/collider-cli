// questions.js
//

'use strict';

var os = require('os');

var inquirer = require('inquirer');

var cwd     = process.cwd();
var homeDir = os.homedir();

module.exports = {

  new: [
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to name your project:',
      validate: function (answer) {
        var cb = this.async();

        if (!answer) {
          cb('Please enter a valid project name.');
          return;
        }

        cb(null, true);
      },
    },
    {
      type: 'list',
      name: 'dir',
      message: 'Where would you like to save it:',
      choices: getDirChoices,
      default: 0,
    },
    {
      type: 'input',
      name: 'author',
      message: 'What is your name:',
      default: 'unknown',
    },
    {
      type: 'checkbox',
      name: 'matterLibs',
      message: 'Which official Matter libraries would you like to use:',
      choices: getMatterLibChoices,
    },
  ],

  edit: [
    {
      type: 'input',
      name: 'author',
      message: 'What is your name:',
    },
    {
      type: 'checkbox',
      name: 'matterLibs',
      message: 'Which official Matter libraries would you like to use:',
      choices: getMatterLibChoices,
    },
  ],

  generate: [
    {
      type: 'list',
      name: 'type',
      message: 'What type of Matter component would you like to generate:',
      choices: [
        {
          name: 'atom',
          value: 'atoms',
        },
        {
          name: 'molecule',
          value: 'molecules',
        },
        {
          name: 'organism',
          value: 'organisms',
        },
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to call it:',
      validate: function (answer) {
        var cb = this.async();

        if (!answer) {
          cb('Please enter a valid component name.');
          return;
        }

        cb(null, true);
      },
    },
    {
      type: 'confirm',
      name: 'data',
      message: 'Will it use a data-file:',
      default: false,
    },
    {
      type: 'list',
      name: 'locale',
      message: 'Which Matter library would you like to add it to:',
      choices: ['project'],
    },
  ],

  update: [
    {
      type: 'confirm',
      name: 'update',
      message: 'Please make sure you\'ve backed up your project before continuing. Continue?',
      default: false,
    },
  ],

  assignDefaults: function (questions, defaults) {
    var augmentedQuestions = [];

    var numQuestions = questions.length;
    for (var i = 0; i < numQuestions; i++) {
      var question = questions[i];

      // Augment question with a default value if it exists.
      if (defaults.hasOwnProperty(question.name)) {
        question.default = defaults[question.name];
      }

      augmentedQuestions.push(question);
    }

    return augmentedQuestions;
  },

};

// CHOICE GENERATORS
//

function getDirChoices() {
  return [
    {
      name: cwd,
      value: cwd,
    },

    new inquirer.Separator(),

    {
      name: 'Desktop',
      value: `${homeDir}/Desktop`,
    },
    {
      name: 'Documents',
      value: `${homeDir}/Documents`,
    },
  ];
}

function getMatterLibChoices() {
  return [
    {
      name: 'BBC News Matter',
      value: 'https://github.com/BBC-News/news-matter.git,news-matter',
      short: 'News Matter',
    },
    {
      name: 'BBC iPlayer Matter',
      value: 'https://github.com/bbc/iplayer-matter.git,iplayer-matter',
      short: 'iPlayer Matter',
    },
  ];
}
