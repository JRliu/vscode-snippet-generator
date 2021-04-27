# vscode snippet 生成器

支持 scss 变量和 css 变量的 snippet 生成。

# 安装

```
yarn add vscode-css-snippet-generator -D
```

# 使用

```
Options:
  -V, --version          output the version number
  -s, --source <source>  var source path
  -n, --name <name>      output file name
  -t, --type <type>      var type
  -h, --help             display help for command

// example
gen-vscode-css-snippet -s ./style/var.scss -n scss-var -t scss

```
