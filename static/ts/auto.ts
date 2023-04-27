import sass from "sass";
import uglifyJS from "uglify-js";
import fs from "fs-extra";
import { resolve, sep } from "path";
import chokidar from "chokidar";

/**
 *    css相关
 */
if (!fs.existsSync(resolve(__dirname, "../css"))) {
  // 创建 css 文件夹
  fs.mkdirSync(resolve(__dirname, "../css"));
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
  try {
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
  } catch (error) {}
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
  try {
    const res = uglifyJS.minify(fs.readFileSync(path, "utf8"), {
      sourceMap: {
        filename: path.replace(".js", ".min.js"),
      },
    });
    fs.writeFileSync(path.replace(".js", ".min.js"), res.code);
  } catch (error) {}
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
if (process.env.NODE_WATCH === "dev") {
  // 监听scss文件改变
  chokidar
    .watch(resolve(__dirname, "../scss"), {
      ignored: /[\/\\]\./,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: false,
      depth: Infinity,
    })
    .on("add", (path) => {
      if (!path.includes(".scss")) return;
      compile(path);
    })
    .on("change", (path) => {
      if (!path.includes(".scss")) return;
      compile(path);
    })
    .on("unlink", (path) => {
      if (!path.includes(".scss")) return;
      fs.unlinkSync(
        path
          .replace(resolve(__dirname, "../scss"), resolve(__dirname, "../css"))
          .replace(".scss", ".min.css")
      );
      fs.unlinkSync(
        path
          .replace(resolve(__dirname, "../scss"), resolve(__dirname, "../css"))
          .replace(".scss", ".css")
      );
    });

  // 监听js文件改变
  chokidar
    .watch(resolve(__dirname, "../js"), {
      ignored: /[\/\\]\./,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: false,
      depth: Infinity,
    })
    .on("add", (path) => {
      if (!path.includes(".js")) return;
      uglify(path);
    })
    .on("change", (path) => {
      if (!path.includes(".js")) return;
      uglify(path);
    });

  // 监听ts文件改变
  chokidar
    .watch(resolve(__dirname, "../ts"), {
      ignored: /[\/\\]\./,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: false,
      depth: Infinity,
    })
    .on("unlink", (path) => {
      if (!path.includes(".ts")) return;
      fs.unlinkSync(
        path
          .replace(resolve(__dirname, "../ts"), resolve(__dirname, "../js"))
          .replace(".ts", ".min.js")
      );
      fs.unlinkSync(
        path
          .replace(resolve(__dirname, "../ts"), resolve(__dirname, "../js"))
          .replace(".ts", ".js")
      );
    });
}
