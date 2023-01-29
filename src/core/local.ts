import { Express } from "express";
export default (app: Express) => {
    app.locals = {
        RUOYU: {},
        cdnUrl: "",
    };
};
