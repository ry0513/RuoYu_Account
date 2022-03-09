import { Router } from "express";
import fs from "fs-extra";
import { needLogin } from "../core/permission";
import { redisDelAccountByRedisId } from "../core/redis";
import RUOYU from "../core/ruoyu";
const router = Router();

// 首页
router.get("/", (req, res) => {
    needLogin(10, req, res, () => {
        res.locals = {
            user: req.session.account,
        };
        res.render("home");
    });
});

// 登录
router.get("/login", (req, res) => {
    needLogin(
        10,
        req,
        res,
        () => {
            res.redirect("/");
        },
        () => {
            res.render("login");
        }
    );
});

// 退出
router.get("/out", (req, res) => {
    needLogin(
        10,
        req,
        res,
        () => {
            const sessionID = req.sessionID;
            req.session.destroy(async () => {
                await redisDelAccountByRedisId(sessionID);
                res.render("out", { msg: "退出成功" });
            });
        },
        () => {
            res.render("out", { msg: "未找到登录信息" });
        }
    );
});

// 装载子路由;
const routeList = fs.readdirSync(RUOYU.path(__dirname)).filter((item) => {
    return item !== "index.js";
});
for (const key of routeList) {
    if (fs.statSync(RUOYU.path(__dirname, key)).isDirectory()) {
        import(RUOYU.path(__dirname, key, "./index")).then((item) => {
            router.use(`/${key}`, item.default);
        });
    } else {
        import(RUOYU.path(__dirname, key)).then((item) => {
            router.use(`/${key.split(".")[0]}`, item.default);
        });
    }
}

export default router;
