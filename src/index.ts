import fs from "fs-extra";
import chalk from "chalk";

interface DataItem {
  name: string;
  desc: string;
  body: string;
  prefix?: string;
}

enum Type {
  SassVar = "sass-var",
  ScssVar = "scss-var",
  CssVar = "css-var",
  SassMixin = "sass-mixin",
  ScssMixin = "scss-mixin",
}

const TypeVals = Object.values(Type);

const Scope = "sass, scss, css";

const hexReg = /(\#[0-9A-F]{6})|(^#[0-9A-F]{3})/gi;
const scssVarReg = /(\$[\w|-]+):\s(.+)/g;
const cssVarReg = /(--[\w|-]+):\s(.+)/g;
const scssMixinReg = /(@mixin)[^}^\n]+{/g;

function getIsSassVar(type: Type) {
  return ["sass-var", "scss-var"].includes(type);
}

function getVarItems(path: string, type: Type): DataItem[] {
  const isSass = getIsSassVar(type);
  const varReg = isSass ? scssVarReg : cssVarReg;
  let content = fs.readFileSync(path, "utf8");

  const ovars = content.match(varReg) || [];
  const vars = ovars.map((v) => {
    let strs = v.split(":");
    let name = strs[0];
    return {
      name,
      desc: strs[1] ? strs[1] : "",
      body: isSass ? "\\" + name + ";" : "var(" + name + ")",
    };
  });

  return vars;
}

function getMixinItems(path: string): DataItem[] {
  let content = fs.readFileSync(path, "utf8");

  const omixins = content.match(scssMixinReg) || [];
  return omixins.map((m) => {
    const name = m.match(/@mixin\s([\w-]+)[\(]?/)![1];
    let body = m.substr(0, m.length - 2);
    body = body.replace("@mixin", "@include") + ";";
    // 去掉参数的默认值
    body = body.replace(/:[\w\W\d\$-\s]+,/, ",");
    body = body.replace(/:[\w\W\d\$-\s]+\)/, ")");

    return {
      name,
      prefix: `@include ${name}`,
      desc: name,
      body,
    };
  });
}

function getSnippets(data: DataItem[]) {
  const snippets = {} as { [k: string]: any };

  data.forEach((v) => {
    const { name, body, prefix, desc } = v;
    snippets[v.name] = {
      prefix: prefix ? prefix : name,
      body,
      description: desc,
      scope: Scope,
    };

    let hexColor = (v.desc.match(hexReg) || [])[0];
    if (hexColor) {
      snippets[hexColor + v.name] = {
        prefix: hexColor,
        body,
        description: v.desc,
        scope: Scope,
      };
    }
  });
  const snippetContent = JSON.stringify(snippets, null, 4);

  return snippetContent;
}

export function gen(sourcePath: string, distPath: string, type: Type) {
  if (!TypeVals.includes(type)) {
    console.log(chalk.red("请输入正确的type"));
    return;
  }
  let content = "";
  if (type.includes("-var")) {
    content = getSnippets(getVarItems(sourcePath, type));
  } else {
    content = getSnippets(getMixinItems(sourcePath));
  }

  const d = distPath;
  fs.ensureFileSync(d);
  fs.writeFileSync(d, content, "utf8");
}
