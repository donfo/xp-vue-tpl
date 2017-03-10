'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var path = require('path');

var optionsConfig = require('./options')
var promptsConfig = require('./prompts')

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments)

    this.argument('name', {
      type: String,
      desc: "your project name",
      required: false
    })

    optionsConfig.map((option) => {
      this.option(option.name, option.def)
    })

    this.storedConfig = this.config.getAll()
  },

  initializing: function () {
    // this.log('initializing');
    this.props = this.config.get('props');
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the fantabulous ' + chalk.red('generator-vue-tpl') + ' generator!'
    ));

    var prompts = promptsConfig(this);

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      if (this.arguments && this.arguments[0] && this.arguments[0].length) {
        this.props.name = this.arguments[0] || 'new-project'
      }
    }.bind(this));
  },

  configuring: function () {
    // this.log('configuring');
    this.config.set('props', this.props);
    this.config.save();
  },

  default: function () {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your project must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  writing: function () {
    this._copy('build/**', 'build')
    this._copy('config/**', 'config')
    this._copy('src/**', 'src')
    this._copy('static/**', 'static')
    this._copy('test/**', 'test')
    this._copyTpl('.babelrc', '.babelrc')
    this._copyTpl('.editorconfig', '.editorconfig')
    this._copyTpl('.eslintignore', '.eslintignore')
    this._copyTpl('.eslintrc.js', '.eslintrc.js')
    this._copyTpl('.gitignore', '.gitignore')
    this._copyTpl('.npmignore', '.npmignore')
    this._copyTpl('.postcssrc.js', '.postcssrc.jse')
    this._copyTpl('_package.json', 'package.json')
    this._copyTpl('env.example.js', 'env.example.js')
    this._copy('index.html', 'index.html')
    this._copyTpl('README.md', 'README.md')
  },

  install: function () {
    if (this.props.autoInstall) {
      this.installDependencies({
        bower: this.props.bowerInstall,
        yarn: this.props.yarnInstall,
        npm: this.props.npmInstall
      });
    }
  },

  conflicts: function () {
    // this.log('conflicts');
  },

  end: function () {
    this.log(chalk.white.bgRed.bold(' Warn ') + ' ' + chalk.green.bold('Please copy env.example.js as env.js'))
    // this.log('end');
  },

  _copy: function (from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to), { globOptions: { dot: true } })
  },

  _copyTpl: function (from, to) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), this, { globOptions: { dot: true } })
  }
});
