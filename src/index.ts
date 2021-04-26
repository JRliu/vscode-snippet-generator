import fs from "fs-extra";

interface VarObj {
  name: string;
  desc: string;
}

type Type = "sass" | "css" | "scss";

function getVarObjs(path: string, type: Type) {
  const isSass = type === "sass";
  const varReg = isSass ? /(\$[\w|-]+):\s(.+)/g : /(--[\w|-]+):\s(.+)/g;
  let content = fs.readFileSync(path, "utf8");

  const ovars = content.match(varReg) || [];
  const vars = ovars.map((v) => {
    let strs = v.split(":");
    return {
      name: strs[0],
      desc: strs[1] ? strs[1] : "",
    };
  });

  return {
    vars,
    type,
  };
}

const Scope = "sass, scss, css";

function getSnippets(params: { vars: VarObj[]; type: Type }) {
  const { vars, type } = params;
  const snippets = {} as { [k: string]: any };
  const isSass = ["sass", "scss"].includes(type);

  vars.forEach((v) => {
    var body = isSass ? "\\" + v.name + ";" : "var(" + v.name + ")";
    snippets[v.name] = {
      prefix: v.name,
      body,
      description: v.desc,
      scope: Scope,
    };

    let hexReg = /(\#[0-9A-F]{6})|(^#[0-9A-F]{3})/gi;
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
  const content = getSnippets(getVarObjs(sourcePath, type));

  const d = distPath;
  fs.ensureFileSync(d);
  fs.writeFileSync(d, content, "utf8");
}
