import sass from "node-sass";
import uglifyJS from "uglify-js";
import fs from "fs-extra";
import { resolve } from "path";
const watch = process.env.NODE_WATCH === "dev";
/**
 *    css相关
 */

// 创建 css 文件夹
if (!fs.existsSync(resolve(__dirname, "../css"))) {
    fs.mkdirSync(resolve(__dirname, "../css"));
}

// 编译
const compile = (path: string) => {
    const dirArr = path.replace(resolve(__dirname, "../scss"), "").split("\\");
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
    const destPath = path.replace("\\scss\\", "\\css\\").replace(".scss", ".css");
    const destMinPath = path.replace("\\scss\\", "\\css\\").replace(".scss", ".min.css");
    sass.render(
        {
            file: path,
            outputStyle: "expanded",
        },
        (err, result) => {
            if (err) throw err;
            fs.writeFileSync(destPath, result.css, "utf8");
        }
    );
    sass.render(
        {
            file: path,
            outputStyle: "compressed",
        },
        (err, result) => {
            if (err) throw err;
            fs.writeFileSync(destMinPath, result.css, "utf8");
        }
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
// 创建 js 文件夹
if (!fs.existsSync(resolve(__dirname, "../js"))) {
    fs.mkdirSync(resolve(__dirname, "../js"));
}

// 压缩
const uglify = (path: string) => {
    const index = path.lastIndexOf(".");
    if (index < 0) return;
    if (path.substring(index + 1) !== "js") return;
    if (path.indexOf(".min.js") !== -1) return;
    const pathArr = path.split("\\");
    const key = pathArr[pathArr.length - 1];
    const res = uglifyJS.minify(fs.readFileSync(path, "utf8"), {
        sourceMap: {
            filename: key.replace(".js", ".min.js"),
            url: key.replace(".js", ".min.map"),
        },
    });
    if (res.error) {
        console.log(res.error);
        return;
    }
    fs.writeFileSync(path.replace(".js", ".min.js"), res.code);
    fs.writeFileSync(path.replace(".js", ".min.map"), res.map);
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
                    fs.unlinkSync(resolve(__dirname, "../css", filename.replace(".scss", ".css")));
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
                    fs.unlinkSync(resolve(__dirname, "../js", filename.replace(".ts", ".js")));
                    fs.unlinkSync(resolve(__dirname, "../js", filename.replace(".ts", ".min.js")));
                    fs.unlinkSync(resolve(__dirname, "../js", filename.replace(".ts", ".min.map")));
                }
            }
        }
    );
}
