import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import bodyParser from "body-parser";

import init from "./core/init";
import Route from "./route/index";
import Api from "./api/index";
import Locals from "./core/local";

(async () => {
  await init();
  const app = express();

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // 初始化 redis, session
  const RedisStrore = connectRedis(session);
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60,
        // maxAge: 1000 * 3,
        // domain: RUOYU.cookieDomain,
      },
      store: new RedisStrore({ client: redis, prefix: "RY_TOKEN:" }),
      secret: "RUOYU",
      name: "RUOYU",
      rolling: true,
      saveUninitialized: false,
      resave: true,
    })
  );

  // 设置模板文件
  app.set("views", common.path(__dirname, "../views"));
  app.set("view engine", "ejs");
  Locals(app);

  // 设置静态文件基础根目录
  app.use("/", express.static(common.path(__dirname, "../static/")));

  // 路由和api
  app.use("/", await Route());
  app.use("/api/", await Api());

  // 捕捉其他未匹配到的
  app.use("*", (req, res) => {
    res.status(404).render("error/404");
  });

  // 启动服务
  app.listen(4000, "0.0.0.0", () => {
    logger.info(`HTTP 模块: [ http://127.0.0.1:4000 ]`);
  });
})();
