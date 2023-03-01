import { Router } from "express";
import { needLogin } from "../core/permission";
import { getUser } from "../db/api/account";
import { getApp } from "../db/api/apps";
import { createRecord } from "../db/api/record";
import { redisDelAccount, redisSetAccount } from "../redis/redis";

const router = Router();

// 登录 login
router.post(
  "/login",
  verify("body", {
    email: joi
      .string()
      .required()
      .email()
      .error(new Error("邮箱不符合验证格式")),
    password: joi.string().required().error(new Error("密码不符合验证格式")),
  }),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await getUser({ email }, ["password", "salt"]);
    if (
      !user ||
      user.password !== common.encryption.encryptAsym(password, user.salt)
    ) {
      if (user) {
        await createRecord(user.accountId, req, false);
      }
      return common.res.error(res, { msg: "邮箱或密码不正确" });
    }

    req.session.account = {
      accountId: user.accountId,
      nickName: user.nickName,
      avatar: user.avatar,
    };

    await createRecord(user.accountId, req, true);
    await redisSetAccount(user.accountId, req.sessionID);

    common.res.success(res, { msg: "登录成功" });
  }
);

// 退出 logout
router.post("/logout", needLogin(), async (req, res) => {
  const sessionID = req.sessionID;
  req.session.destroy(async () => {
    await redisDelAccount({ redisId: sessionID });
    common.res.success(res, { msg: "退出成功" });
  });
});

// 获取信息 getUser
router.post(
  "/getUser",
  verify("body", {
    appId: joi
      .number()
      .required()
      .integer()
      .error(new Error("appId 不符合验证格式")),
    serveKey: joi
      .string()
      .required()
      .error(new Error("serveKey 不符合验证格式")),
    tk: joi
      .string()
      .required()
      .alphanum()
      .length(32)
      .error(new Error("tk 不符合验证格式")),
  }),
  async (req, res) => {
    const { appId, serveKey, tk } = req.body;
    const app = await getApp({ appId, serveKey });
    if (!app) {
      return common.res.error(res, { data: "未认证的请求" });
    }
    redis.get(`apps:${tk}`, (err, user) => {
      if (!user) {
        return common.res.error(res, { data: "未认证的请求" });
      }
      redis.del(`apps:${tk}`, async () => {
        common.res.success(res, {
          data: await getUser({
            accountId: JSON.parse(user).account.accountId,
          }),
        });
      });
    });
  }
);

export default router;
