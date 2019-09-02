#! /usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");


_commander2.default.version("1.0.0", "-v, --version").command("init <name>").action(function (name) {
  if (!fs.existsSync(name)) {
    _inquirer2.default.prompt([{
      type: "input",
      name: "cli",
      message: "Project name",
      default: name
    }, {
      type: "input",
      name: "cli",
      message: "Project description",
      default: "A bw-cli project"
    }, {
      type: "input",
      name: "author",
      message: "请输入作者名称"
    }, {
      name: "conf",
      type: "confirm",
      message: "Install vue-router?"
    }, {
      type: "expand",
      message: "请选择一种水果：",
      name: "fruit",
      choices: [{
        key: "a",
        name: "Apple",
        value: "apple"
      }, {
        key: "O",
        name: "Orange",
        value: "orange"
      }, {
        key: "p",
        name: "Pear",
        value: "pear"
      }]
    }, {
      type: "checkbox",
      message: "选择颜色:",
      name: "color",
      choices: ["red", "blur", "green", "yellow"],
      pageSize: 2 }, {
      type: "list",
      message: "Should we run `npm install` for you after the project has been created? (recommended)",
      name: "dowload",
      choices: ["Yes, use NPM", "Yes, use Yarn", "No, I will handle that myself"],
      filter: function filter(val, i) {
        return val.toLowerCase();
      }
    }, {
      type: "password",
      message: "请输入密码：",
      name: "pwd"
    }]).then(function (answers) {
      var spinner = (0, _ora2.default)("正在下载模板...");
      spinner.start();
      (0, _downloadGitRepo2.default)("direct:https://github.com/123456-kkk/ba-cli.git#master", name, { clone: true }, function (err) {
        if (err) {
          spinner.fail();
          console.log(_logSymbols2.default.error, _chalk2.default.red(err));
        } else {
          spinner.succeed();
          var fileName = name + '/package.json';
          var meta = {
            name: name,
            description: answers.description,
            author: answers.author
          };
          if (fs.existsSync(fileName)) {
            var content = fs.readFileSync(fileName).toString();
            var result = _handlebars2.default.compile(content)(meta);
            fs.writeFileSync(fileName, result);
          }
          console.log(_logSymbols2.default.success, _chalk2.default.green("项目初始化完成"));
        }
      });
    });
  } else {
    console.log(_logSymbols2.default.error, _chalk2.default.red("项目已存在"));
  }
});

_commander2.default.parse(process.argv);