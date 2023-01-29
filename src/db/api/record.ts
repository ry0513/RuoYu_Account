import Record from "../modles/Record";
import { Request } from "express";
import { getUa } from "../../core/tools";

export const createRecord = async (accountId: number, req: Request, success: boolean) => {
    const ip = "127.0.0.1";
    const place = "未知";
    return Record.create({ accountId, success, ip, place, ...getUa(req.headers["user-agent"]) });
};
