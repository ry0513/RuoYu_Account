import { Request, Response, NextFunction } from "express";

// 权限中间件
export const needLogin = ({ toLogin } = { toLogin: false }) => {
  return (
    { session: { account }, originalUrl }: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (account) {
      next();
    } else {
      if (toLogin) {
        res.redirect(`/login?path=${encodeURIComponent(originalUrl)}`);
      } else {
        common.res.needLogin(res);
      }
    }
  };
};
