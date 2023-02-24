import sass from "sass";
import uglifyJS from "uglify-js";
import fs from "fs-extra";
import { resolve, sep } from "path";
const watch = process.env.NODE_WATCH === "dev";

/**
 *    css相关
 */
// 创建 css 文件夹
if (!fs.existsSync(resolve(__dirname, "../css"))) {
  fs.mkdirSync(resolve(__dirname, "../css"));
}
// 创建 scss 文件夹
if (!fs.existsSync(resolve(__dirname, "../scss"))) {
  fs.mkdirSync(resolve(__dirname, "../scss"));
}

// 编译
const compile = (path: string) => {
  const dirArr = path.replace(resolve(__dirname, "../scss"), "").split(sep);
  dirArr.shift();
  dirArr.pop();
  dirArr.forEach((item, i) => {
    const arr = [...dirArr];
    arr.length = i + 1;
    const dir = resolve(__dirname, "../css", arr.join("/"));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  const destPath = path
    .replace(`${sep}scss${sep}`, `${sep}css${sep}`)
    .replace(".scss", ".css");
  const destMinPath = path
    .replace(`${sep}scss${sep}`, `${sep}css${sep}`)
    .replace(".scss", ".min.css");
  fs.writeFileSync(
    destPath,
    sass.compile(path, { style: "expanded" }).css,
    "utf8"
  );
  fs.writeFileSync(
    destMinPath,
    sass.compile(path, { style: "compressed" }).css,
    "utf8"
  );
};

// 自动检测文件
const autoCompile = (path = "../scss") => {
  for (const key of fs.readdirSync(resolve(__dirname, path))) {
    if (fs.statSync(resolve(__dirname, path, key)).isDirectory()) {
      autoCompile(resolve(__dirname, path, key));
    } else {
      compile(resolve(__dirname, path, key));
    }
  }
};
autoCompile();

/**
 *    js相关
 */
// 压缩
const uglify = (path: string) => {
  const index = path.lastIndexOf(".");
  if (index < 0) return;
  if (path.substring(index + 1) !== "js") return;
  if (path.indexOf(".min.js") !== -1) return;
  const res = uglifyJS.minify(fs.readFileSync(path, "utf8"), {
    sourceMap: {
      filename: path.replace(".js", ".min.js"),
    },
  });
  if (res.error) {
    return;
  }
  fs.writeFileSync(path.replace(".js", ".min.js"), res.code);
};

// 自动检测
const autoUglify = (path = "../js") => {
  const list = fs.readdirSync(resolve(__dirname, path)).filter((item) => {
    return item.indexOf(".min.js") === -1;
  });
  for (const key of list) {
    if (fs.statSync(resolve(__dirname, path, key)).isDirectory()) {
      autoUglify(resolve(__dirname, path, key));
    } else {
      uglify(resolve(__dirname, path, key));
    }
  }
};
autoUglify();

/**
 *    监听
 */
if (watch) {
  // 监听scss文件改变
  fs.watch(
    resolve(__dirname, "../scss"),
    {
      recursive: true,
    },
    (eventType, filename) => {
      if (!filename.includes(".scss")) return;
      if (eventType === "change") {
        setTimeout(() => {
          compile(resolve(__dirname, "../scss", filename));
        }, 100);
      } else if (eventType === "rename") {
        if (!fs.existsSync(resolve(__dirname, "../scss", filename))) {
          fs.unlinkSync(
            resolve(__dirname, "../css", filename.replace(".scss", ".min.css"))
          );
          fs.unlinkSync(
            resolve(__dirname, "../css", filename.replace(".scss", ".css"))
          );
        } else {
          setTimeout(() => {
            compile(resolve(__dirname, "../scss", filename));
          }, 100);
        }
      }
    }
  );

  // 监听js文件改变
  fs.watch(
    resolve(__dirname, "../js"),
    {
      recursive: true,
    },
    (eventType, filename) => {
      if (eventType === "change") {
        uglify(resolve(__dirname, "../js", filename));
      }
    }
  );

  // 监听ts文件改变
  fs.watch(
    resolve(__dirname, "../ts"),
    {
      recursive: true,
    },
    (eventType, filename) => {
      if (!filename.includes(".ts")) return;
      if (eventType === "rename") {
        if (!fs.existsSync(resolve(__dirname, "../ts", filename))) {
          fs.unlinkSync(
            resolve(__dirname, "../js", filename.replace(".ts", ".js"))
          );
          fs.unlinkSync(
            resolve(__dirname, "../js", filename.replace(".ts", ".min.js"))
          );
        }
      }
    }
  );
}
