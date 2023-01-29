import { createHmac, createHash } from "crypto";
import { resolve } from "path";
global.common = {
  sleep: (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  import: (path: string) => {
    return new Promise((resolve) =>
      import(path).then((item) => resolve(item.default))
    );
  },

  path: (dir, ...other) => {
    return resolve(dir, ...other);
  },

  exit: () => {
    logger.info("系统将于三秒后退出");
    return new Promise(() => setTimeout(process.exit, 3000));
  },

  md5Pass: (val: string, md5Val = "RUOYU") => {
    return createHmac("sha256", md5Val).update(val).digest("hex");
  },

  md5: (val: string) => {
    return createHash("md5").update(val).digest("hex");
  },
};
