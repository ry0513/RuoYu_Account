import Record from "../modles/Record";
import { Request } from "express";
import { getCity, getIp, getUa } from "../../core/tools";
/**
 * @description 创建登录信息
 * @param accountId 账号ID
 * @param req
 * @param success 是否登录成功
 */
export const createRecord = async (
  accountId: number,
  req: Request,
  success: boolean
) => {
  const ip = getIp(req);
  const place = await getCity(ip);
  return Record.create({
    accountId,
    success,
    ip,
    place,
    ...getUa(req.headers["user-agent"]),
  });
};
