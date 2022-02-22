import { Express } from "express";
import RUOYU from "../ruoyu";
export default (app: Express) => {
    app.locals = {
        RUOYU: {},
        cdnUrl: RUOYU.cdnUrl || "",
        dayjs: RUOYU.dayjs,
    };
};
