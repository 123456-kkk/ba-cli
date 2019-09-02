#! /usr/bin/env node
const fs = require("fs");
import program from 'commander'
import download from 'download-git-repo'
import handlebars from 'handlebars'
import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import symbols from 'log-symbols'

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
            default: name
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
