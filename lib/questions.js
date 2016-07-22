// questions.js
//

var filters    = require('./filters');
var validators = require('./validators');

var cwd = process.cwd();

module.exports = {

  new: [
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to name your project:',
      filter: filters.projectName,
      validate: validators.isNotEmpty,
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
      type: 'confirm',
      name: 'hasMatter',
      message: 'Would you like to import any official Matter libraries:',
      default: false,
    },
    {
      type: 'checkbox',
      name: 'matterLibs',
      message: 'Which official Matter libraries would you like to import:',
      choices: getMatterLibChoices,
      when: function (answers) {
        return answers.hasMatter;
      },
    },
  ],

  edit: [
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to name your project:',
      filter: filters.projectName,
      validate: validators.isNotEmpty,
    },
    {
      type: 'input',
      name: 'author',
      message: 'What is your name:',
    },
    {
      type: 'confirm',
      name: 'hasMatter',
      message: 'Would you like to import any official Matter libraries:',
    },
    {
      type: 'checkbox',
      name: 'matterLibs',
      message: 'Which official Matter libraries would you like to import:',
      choices: getMatterLibChoices,
      when: function (answers) {
        return answers.hasMatter;
      },
    },
  ],

  generate: [
    {
      type: 'list',
      name: 'type',
      message: 'What type of Matter component would you like to generate:',
      choices: ['atom', 'molecule', 'organism'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What would you like to call it:',
      filter: filters.matterName,
      validate: validators.isNotEmpty,
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
  ];
}

function getMatterLibChoices() {
  return [
    {
      name: '',
      value: '',
      short: '',
    },
  ];
}
