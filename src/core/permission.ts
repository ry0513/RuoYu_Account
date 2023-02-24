import { Request, Response, NextFunction } from "express";

/**
 * @description 账号信息
 * @param toLogin 是否跳转登录页
 */
export const needLogin = ({ toLogin = false } = {}) => {
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
