import { Router } from "express";
import fs from "fs-extra";

export default async () => {
  return new Promise<Router>(async (resolve) => {
    const router = Router();

    // 装载子路由;
    const routeList = fs.readdirSync(common.path(__dirname)).filter((item) => {
      return item !== "index.js";
    });
    for (const key of routeList) {
      await new Promise<boolean>((resolve, reject) => {
        if (fs.statSync(common.path(__dirname, key)).isDirectory()) {
          import(common.path(__dirname, key, "./index")).then((item) => {
            router.use(`/${key}`, item.default);
            resolve(true);
          });
        } else {
          import(common.path(__dirname, key)).then((item) => {
            router.use(`/${key.split(".")[0]}`, item.default);
            resolve(true);
          });
        }
      });
    }
    resolve(router);
  });
};
