#!/usr/bin/env node

const program = require('commander')
const version = require('../package.json').version
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const lib = require('../dist/index.js')

program
    .version(version)
    .option('-s, --source <source>', 'var source path')
    .option('-d, --dist <dist>', 'snippet dist path')
    .option('-t, --type <type>', 'var type')
    .action((opt) => {
        let s = opt.source

        let d = opt.dist ? path.join(process.cwd(), opt.dist) : path.join(process.cwd(), ".vscode/scss-var.code-snippets")

        let t = opt.type || 'sass'

        if (s) {
            s = path.join(process.cwd(), s)
        } else {
            console.log(chalk.red('请传入变量文件地址'))
            return
        }

        if (!fs.existsSync(s)) {
            console.log(chalk.red('错误的变量文件地址：' + s))
            return
        }


        lib.gen(s, d, t)
    })

program.parse()
