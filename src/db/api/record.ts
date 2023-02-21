import Record from "../modles/Record";
import { Request } from "express";
import { getCity, getIp, getUa } from "../../core/tools";
/**
 *
 * @param accountId 账号ID
 * @param req
 * @param success 是否登录成功
 * @returns
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
