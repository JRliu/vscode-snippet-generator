#!/usr/bin/env node

const program = require('commander')
const version = require('../package.json').version
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const lib = require('../dist/index.js')

program
  .version(version)
  .option('-s, --source <source>', 'source file path')
  .option('-n, --name <name>', 'output file name, default: source file name')
  .option('-t, --type <type>', 'type, option: sass-var/css-var/less-var/sass-mixin')
  .action((opt) => {
    let source = opt.source

    // 默认取source文件的文件名
    const name = opt.name || path.basename(source).split('.')[0]
    const dist = path.join(process.cwd(), `.vscode/${name}.code-snippets`)

    const t = opt.type || 'sass'

    if (source) {
      source = path.join(process.cwd(), source)
    } else {
      console.log(chalk.red('请传入变量文件地址'))
      return
    }

    if (!fs.existsSync(source)) {
      console.log(chalk.red('错误的变量文件地址：' + source))
      return
    }

    lib.gen(source, dist, t)
  })

program.parse()
