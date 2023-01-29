import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import Joi from 'joi';
// import { celebrate, Joi, errors, Segments } from 'celebrate';
// import { redisDelAccountByAccountId, redisSetAccount } from "../core/redis";
// import RUOYU from "../core/ruoyu";
// import { toString } from "../core/tools";
// import { getUser } from "../db/api/account";
// import { createRecord } from "../db/api/record";

const router = Router();
const a = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    year: Joi.number()
})
//     a.validate()

// const middleware = (schema: any, property: any) => {
//     return (req, res, next) => {
//         const { error } = Joi.validate(req.body, schema);
//         const valid = error == null;

//         if (valid) {
//             next();
//         } else {
//             const { details } = error;
//             const message = details.map(i => i.message).join(',');

//             console.log("error", message);
//             res.status(422).json({ error: message })
//         }
//     }
// }


const sss = (property: "body" | "query", schema: Joi.ObjectSchema<any>) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { error } = schema.validate(req[property]);
        console.log(error);
        const valid = error == null;
        if (valid) { next(); }
        else {
            const { details } = error;
            const message = details.map(i => i.message).join(',')
            console.log("error", message);
            res.status(422).json({ error: message })
        }
    }
}

router.post("/login", sss("body", Joi.object().keys({
    title: Joi.string().required().messages({
        "string.empty": "用户名必填",
        "any.required": "用户名必填",
        "string.alphanum": '只能包含a-zA-Z0-9',
        "string.max": '用户名长度不能超过10',
    }),
    description: Joi.string().required(),
    year: Joi.number()
})), (req, res) => {
    res.send({ w: 33 })
})
// router.post("/login", celebrate({
//     [Segments.BODY]: Joi.object().keys({
//         name: Joi.string().min(5).max(12).required().messages({
//             "string.empty": "用户名必填",
//             "any.required": "用户名必填",
//             "string.alphanum": '只能包含a-zA-Z0-9',
//             "string.max": '用户名长度不能超过10',
//         }),//自己定义提示内容
//         password: Joi.string().required(),
//     }),

// }), async (req, res) => {
//     console.log(req.body);


//     req.session.account = { accountId: 67 };
//     console.log(req.sessionID);

//     // redis.set('324324', {
//     //     description: 'sdsd',
//     //     url: 'http://www.abc.com/abc.html',
//     //     appId: '123456'
//     // });

//     // redis.hmset("aaa", { aaa: 333 }, function (err) {
//     //     console.log(err)
//     // })
//     // redis.hmset("aaa", { username: 456, }, function (err) {
//     //     console.log(err)
//     // })
//     // redis.hmset("aaa", { aaawww: "ijjj", }, function (err) {
//     //     console.log(err)
//     // })
//     // redis.hgetall("aaa", function (err, object) {
//     //     console.log(object["username"])
//     // })

//     res.send({ aa: 333 })
// })


// router.post("/login", async (req, res) => {
//     const email = toString(req.body.email);
//     const password = toString(req.body.password);
//     if (email && password) {
//         const user = await getUser({ email }, ["password"]);
//         if (user) {
//             if (RUOYU.md5Pass(password) === user?.password) {
//                 req.session.account = user;
//                 await createRecord(user.accountId, req, true);
//                 await redisDelAccountByAccountId(user.accountId);
//                 await redisSetAccount(user.accountId, req.sessionID);
//                 RUOYU.res.success(res, {
//                     msg: "登录成功",
//                     sessionID: req.sessionID,
//                     session: req.session,
//                 });
//                 console.log(res.getHeaders()["set-cookie"]);
//                 const cook = res.getHeaders()["set-cookie"];
//                 const getCookie = function (name: string, cookie: string) {
//                     let arr;
//                     const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//                     if ((arr = cookie.match(reg))) return decodeURI(arr[2]);
//                     else return null;
//                 };

//                 console.log(
//                     getCookie(
//                         "RUOYU_SESSION_ID",
//                         (typeof cook === "object" && cook[0]) || cook + ""
//                     )
//                 );

//                 return;
//             }
//             // s%3AbyrNwfqfdUF5Tsp_wRukk5ezHcwRTpSN.A%2BwUhJmch5MFnXFdOnmhk3pxah02xJJu1aRU41BxBMc
//             createRecord(user.accountId, req, false);
//         }
//         RUOYU.res.error(res, { msg: "邮箱或密码不正确" });
//         return;
//     }
//     RUOYU.res.parameter(res);
// });

export default router;
