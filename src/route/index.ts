import { Router, Request, Response } from "express";
import { needLogin } from "../core/permission";
import { getApp } from "../db/api/apps";
// import fs from "fs-extra";
// import { needLogin } from "../core/permission";
// import { redisDelAccountByRedisId } from "../core/redis";
// import RUOYU from "../core/ruoyu";
const router = Router();

// 首页
router.get("/", needLogin({ toLogin: true }), (req, res) => {
  res.locals = {
    user: req.session.account,
  };
  res.render("home");
});

// 登录
router.get("/login", (req, res) => {
  if (req.session.account) {
    return res.redirect("/");
  }
  res.render("login");
});

// token
router.get(
  "/token",
  verify("query", {
    redirectUri: joi
      .string()
      .required()
      .error(new Error("redirectUri 不符合验证格式")),
    appId: joi
      .number()
      .required()
      .integer()
      .error(new Error("appId 不符合验证格式")),
    clientKey: joi
      .string()
      .required()
      .error(new Error("clientKey 不符合验证格式")),
  }),
  needLogin({ toLogin: true }),
  async (req: Request<{}, {}, {}, RequestGet>, res: Response) => {
    const { redirectUri, appId, clientKey } = req.query;
    const app = await getApp({ appId, clientKey });
    if (!app) {
      return common.res.error(res);
    }
    const tk = common.UUID("");
    redis.set(
      `apps:${tk}`,
      JSON.stringify({ app, account: req.session.account }),
      "EX",
      60 * 5
    );
    return res.redirect(`${redirectUri}?tk=${tk}`);
  }
);

// // // 退出
// router.get("/out", (req, res) => {
//     needLogin(
//         10,
//         req,
//         res,
//         () => {
//             const sessionID = req.sessionID;
//             req.session.destroy(async () => {
//                 await redisDelAccountByRedisId(sessionID);
//                 res.render("out", { msg: "退出成功" });
//             });
//         },
//         () => {
//             res.render("out", { msg: "未找到登录信息" });
//         }
//     );
// });

// // 装载子路由;
// const routeList = fs.readdirSync(RUOYU.path(__dirname)).filter((item) => {
//     return item !== "index.js";
// });
// for (const key of routeList) {
//     if (fs.statSync(RUOYU.path(__dirname, key)).isDirectory()) {
//         import(RUOYU.path(__dirname, key, "./index")).then((item) => {
//             router.use(`/${key}`, item.default);
//         });
//     } else {
//         import(RUOYU.path(__dirname, key)).then((item) => {
//             router.use(`/${key.split(".")[0]}`, item.default);
//         });
//     }
// }

export default router;
