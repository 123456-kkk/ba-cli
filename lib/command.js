#! /usr/bin/env node

// const program = require("commander");
// const inquirer = require("inquirer");
// // const file = require("../package.json");
// // const ora = require('ora');
// const fs = require("fs");
// program
//   .version("0.0.1")
//   .option("-C, --chdir <path>", "change the working directory")
//   .option("-c, --config <path>", "set config path. defaults to ./deploy.conf")
//   .option("-T, --no-tests", "ignore test hook");

// program
//   .command("init <cmd>")
//   .description("run remote init commands")
//   .action(function(name) {
//     inquirer
//       .prompt([
//         {
//           type: "confirm",
//           name: "cli",
//           message: "Project name",
//           default: app
//         },
//         {
//           type: "confirm",
//           name: "cli",
//           message: "Project description",
//           default: "A bw-cli project"
//         },
//         {
//           type: 'input',
//           name: 'author',
//           message: '请输入作者名称'
//           },
//         {
//           name: "conf",
//           type: "confirm",
//           message: "Install vue-router?"
//         },
//         {
//           type: "expand",
//           message: "请选择一种水果：",
//           name: "fruit",
//           choices: [
//             {
//               key: "a",
//               name: "Apple",
//               value: "apple"
//             },
//             {
//               key: "O",
//               name: "Orange",
//               value: "orange"
//             },
//             {
//               key: "p",
//               name: "Pear",
//               value: "pear"
//             }
//           ]
//         },
//         {
//           type: "checkbox",
//           message: "选择颜色:",
//           name: "color",
//           choices: ["red", "blur", "green", "yellow"],
//           pageSize: 2 // 设置行数
//         },
//         {
//           type: "list",
//           message:
//             "Should we run `npm install` for you after the project has been created? (recommended)",
//           name: "dowload",
//           choices: [
//             "Yes, use NPM",
//             "Yes, use Yarn",
//             "No, I will handle that myself"
//           ],
//           filter: function(val, i) {
//              // 使用filter将回答变为小写
//             return val.toLowerCase();
//           }
//         },
//         {
//           type: "password", // 密码为密文输入
//           message: "请输入密码：",
//           name: "pwd"
//         }
//       ])
//       .then(answers => {
//         if (!answers.cli) {
//           return;
//         } else {
//           fs.mkdirSync(app);
//           console.log(answers);
//         }
//         const meta = {
//           name,
//           description: answers.description,
//           author: answers.author
//           }
//           const fileName = `${name}/package.json`;
//           const content = fs.readFileSync(fileName).toString();
//           const result = handlebars.compile(content)(meta);
//           fs.writeFileSync(fileName, result);

//       });
//   });

const fs = require("fs");
const program = require("commander");
const download = require("download-git-repo");
const handlebars = require("handlebars");
const inquirer = require("inquirer");
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");

program
  .version("1.0.0", "-v, --version")
  .command("init <name>")
  .action(name => {
    if (!fs.existsSync(name)) {
      inquirer
        .prompt([
          {
            type: "input",
            name: "cli",
            message: "Project name",
            default: app
          },
          {
            type: "input",
            name: "cli",
            message: "Project description",
            default: "A bw-cli project"
          },
          {
            type: "input",
            name: "author",
            message: "请输入作者名称"
          },
          {
            name: "conf",
            type: "confirm",
            message: "Install vue-router?"
          },
          {
            type: "expand",
            message: "请选择一种水果：",
            name: "fruit",
            choices: [
              {
                key: "a",
                name: "Apple",
                value: "apple"
              },
              {
                key: "O",
                name: "Orange",
                value: "orange"
              },
              {
                key: "p",
                name: "Pear",
                value: "pear"
              }
            ]
          },
          {
            type: "checkbox",
            message: "选择颜色:",
            name: "color",
            choices: ["red", "blur", "green", "yellow"],
            pageSize: 2 // 设置行数
          },
          {
            type: "list",
            message:
              "Should we run `npm install` for you after the project has been created? (recommended)",
            name: "dowload",
            choices: [
              "Yes, use NPM",
              "Yes, use Yarn",
              "No, I will handle that myself"
            ],
            filter: function(val, i) {
              // 使用filter将回答变为小写
              return val.toLowerCase();
            }
          },
          {
            type: "password", // 密码为密文输入
            message: "请输入密码：",
            name: "pwd"
          }
        ])
        .then(answers => {
          const spinner = ora("正在下载模板...");
          spinner.start();
          download(
            "direct:https://github.com/123456-kkk/ba-cli.git#master",
            name,
            { clone: true },
            err => {
              if (err) {
                spinner.fail();
                console.log(symbols.error, chalk.red(err));
              } else {
                spinner.succeed();
                const fileName = `${name}/package.json`;
                const meta = {
                  name,
                  description: answers.description,
                  author: answers.author
                };
                if (fs.existsSync(fileName)) {
                  const content = fs.readFileSync(fileName).toString();
                  const result = handlebars.compile(content)(meta);
                  fs.writeFileSync(fileName, result);
                }
                console.log(symbols.success, chalk.green("项目初始化完成"));
              }
            }
          );
        });
    } else {
      console.log(symbols.error, chalk.red("项目已存在"));
    }
  });

program.parse(process.argv);
