import {
  createHmac,
  createCipheriv,
  createDecipheriv,
  randomUUID,
  createHash,
} from "crypto";
import { resolve } from "path";

global.common = {
  baseConfig: {
    cdnUrl: "",
    crypto: {
      key: "",
      iv: "",
      salt: "",
    },
  },
  map: {
    serve: "",
    key: "",
    sk: "",
  },

  UUID: (_ = "-") => {
    return randomUUID({ disableEntropyCache: true }).replace(/-/g, _);
  },

  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  import: (path) => {
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

  encryption: {
    encrypt: (
      val,
      key = common.baseConfig.crypto.key,
      iv = common.baseConfig.crypto.iv
    ) => {
      let encrypted = "";
      const cipher = createCipheriv("aes-256-cbc", key, iv);
      encrypted += cipher.update(val, "utf8", "base64");
      encrypted += cipher.final("base64");
      return encrypted;
    },

    decrypt: (
      val,
      key = common.baseConfig.crypto.key,
      iv = common.baseConfig.crypto.iv
    ) => {
      try {
        let decrypted = "";
        const cipher = createDecipheriv("aes-256-cbc", key, iv);
        decrypted += cipher.update(val, "base64", "utf8");
        decrypted += cipher.final("utf8");
        return decrypted;
      } catch (error) {
        return null;
      }
    },

    encryptAsym: (val, salt = common.baseConfig.crypto.salt) => {
      return createHmac("sha256", salt).update(val).digest("hex");
    },
    md5: (value) => {
      return createHash("md5").update(value).digest("hex");
    },
  },

  rules: {
    passWord: { reg: /^[a-zA-Z0-9@?!]{3,20}$/, msg: "请检查密码格式" },
  },

  res: {
    success: (res, obj = {}) => {
      res.send({ code: 0, msg: "操作成功", ...obj });
    },

    parameter: (res, obj = {}) => {
      res.send({ code: -1, msg: "请检查参数", ...obj });
    },

    needLogin: (res, obj = {}) => {
      res.send({ code: -2, msg: "没有找到登录信息，未登录或登录过期", ...obj });
    },
    permission: (res, obj = {}) => {
      res.send({ code: -3, msg: "权限不足", ...obj });
    },
    error: (res, obj = {}) => {
      res.send({ code: -4, msg: "操作失败", ...obj });
    },
  },
};
