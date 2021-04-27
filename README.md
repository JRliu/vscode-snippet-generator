# vscode snippet 生成器

支持 sass/css 变量和 sass mixin 的 snippet 生成。

# 原理

使用正则匹配出对应文件内的变量/mixin，在项目根目录的`.vscode`文件夹内生成对应的`snippet`配置文件。

# 安装

```
yarn add vscode-css-snippet-generator -D
```

# 使用

```zsh
Options:
  -V, --version          output the version number
  -s, --source <source>  var source path
  -n, --name <name>      output file name
  -t, --type <type>      var type, option: sass-var/css-var/sass-mixin
  -h, --help             display help for command

// example
npx gen-vscode-css-snippet -s ./style/var.scss -n scss-var -t scss-var

npx gen-vscode-css-snippet -s ./style/mixin.scss -n scss-mixin -t scss-mixin
```
