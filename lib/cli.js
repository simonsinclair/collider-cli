// cli.js
//

var commands  = require('./commands');
var collider  = require('./collider');
var pkg       = require('../package.json');
var questions = require('./questions');

var inquirer = require('inquirer');

module.exports = function (argv) {
  var command = argv._[0];

  switch (command) {
    case 'new':
      inquirer.prompt(questions.new)
        .then(commands.new);
      break;

    case 'open':
      collider.load('.', function (err, project) {
        if (err) {
          err.message = err.code === 'ENOENT' ? 'A collider.json file could not be found. Is this a Collider project?' : err.message;
          throw err;
        }

        commands.open(project);
      });

      break;

    case 'edit':
      collider.load('.', function (err, defaults) {
        if (err) throw err;
        questions.edit = questions.assignDefaults(questions.edit, defaults);

        inquirer.prompt(questions.edit)
          .then(commands.edit);
      });

      break;

    case 'generate':
      inquirer.prompt(questions.generate)
        .then(commands.generate);
      break;

    case 'update':
      inquirer.prompt(questions.update)
        .then(commands.update);
      break;

    default:
      if (argv.help) {
        console.log(getHelp());
        break;
      }

      if (argv.version) {
        console.log(getVersion());
        break;
      }

      console.error(getHelp());
  }

};

function getHelp() {
  return `
usage:
  collider new       Create a new project.
  collider open      Open the current project.
  collider edit      Edit the current project's settings.
  collider generate  Generate Matter component starting files.
  collider update    Update Collider to the latest version.

options:
  -h, --help         Show this message.
  -v, --version      Show this program's version.
  `;
}

function getVersion() {
  return `
Collider CLI v${pkg.version}
  `;
}
