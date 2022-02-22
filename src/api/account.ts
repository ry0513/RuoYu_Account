import { Router } from "express";
import { redisDelAccountByAccountId, redisSetAccount } from "../core/redis";
import RUOYU from "../core/ruoyu";
import { toString } from "../core/tools";
import { getUser } from "../db/api/account";
import { createRecord } from "../db/api/record";

const router = Router();

router.post("/login", async (req, res) => {
    const email = toString(req.body.email);
    const password = toString(req.body.password);
    if (email && password) {
        const user = await getUser({ email }, ["password"]);
        if (user) {
            if (RUOYU.md5Pass(password) === user?.password) {
                req.session.account = user;
                await createRecord(user.accountId, req, true);
                await redisDelAccountByAccountId(user.accountId);
                await redisSetAccount(user.accountId, req.sessionID);
                RUOYU.res.success(res, { msg: "登录成功" });
                return;
            }
            createRecord(user.accountId, req, false);
        }
        RUOYU.res.error(res, { msg: "邮箱或密码不正确" });
        return;
    }
    RUOYU.res.parameter(res);
});

export default router;
