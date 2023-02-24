import { Router, Request, Response } from "express";
import fs from "fs-extra";
import { needLogin } from "../core/permission";
import { getApp } from "../db/api/apps";

export default async () => {
  return new Promise<Router>(async (resolve) => {
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

    // 第三方登录获取token
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
        // 设置第三方tk，有效期5分钟
        redis.set(
          `apps:${tk}`,
          JSON.stringify({ app, account: req.session.account }),
          "EX",
          60 * 5
        );
        return res.redirect(`${redirectUri}?tk=${tk}`);
      }
    );

    // 装载子路由;
    const routeList = fs.readdirSync(common.path(__dirname)).filter((item) => {
      return item !== "index.js";
    });
    for (const key of routeList) {
      await new Promise<boolean>((resolve, reject) => {
        if (fs.statSync(common.path(__dirname, key)).isDirectory()) {
          import(common.path(__dirname, key, "./index")).then((item) => {
            router.use(`/${key}`, item.default);
            resolve(true);
          });
        } else {
          import(common.path(__dirname, key)).then((item) => {
            router.use(`/${key.split(".")[0]}`, item.default);
            resolve(true);
          });
        }
      });
    }
    resolve(router);
  });
};
