import inquirer from "inquirer";
import fs from "fs-extra";

import { mysqlTest } from "../db/sequelize";
import { redisTest } from "../redis/redis";
import { number } from "joi";

/**
 * @description 创建mysql配置文件
 */
export const createMysql = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    const mysql = await inquirer.prompt([
      {
        type: "Input",
        message: "请输入主机名：",
        name: "host",
        default: "localhost",
      },
      {
        type: "Input",
        message: "请输入端口号：",
        name: "port",
        default: 3306,
      },
      {
        type: "Input",
        message: "请输入数据库名：",
        name: "database",
      },
      {
        type: "Input",
        message: "请输入用户名：",
        name: "user",
      },
      {
        type: "Password",
        message: "请输入密码：",
        name: "password",
        mask: "*",
      },
    ]);
    logger.info("开始测试 MYSQL 信息");
    if (await mysqlTest(mysql)) {
      fs.writeFileSync(path, JSON.stringify(mysql, null, 4));
      logger.info(`已生成 MYSQL 配置,位置：${path}`);
      resolve(true);
    } else {
      logger.info("请重新输入 MYSQL 配置信息：");
      resolve(createMysql(path));
    }
  });
};

/**
 * @description 创建redis配置文件
 */
export const createRedis = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    const redis = await inquirer.prompt([
      {
        type: "Input",
        message: "请输入主机名：",
        name: "host",
        default: "localhost",
      },
      {
        type: "number",
        message: "请输入端口号：",
        name: "port",
        default: 6379,
      },
      {
        type: "Password",
        message: "请输入密码：",
        name: "password",
        mask: "*",
      },
    ]);
    logger.info("开始测试 REDIS 信息");
    const size: number | false = await redisTest(redis);

    if (size !== false) {
      logger.info(`数据库数量：${size}`);
      redis.db = (
        await inquirer.prompt([
          {
            name: "rawlist",
            type: "list",
            message: "请选择数据库",
            choices: () => {
              const list = [];
              for (let i = 0; i < size; i++) {
                list.push({ value: i, name: `db${i}` });
              }
              return list;
            },
          },
        ])
      ).rawlist;
      fs.writeFileSync(path, JSON.stringify(redis, null, 4));
      logger.info(`已生成 REDIS 配置,位置：${path}`);
      resolve(true);
    } else {
      logger.info("请重新输入 REDIS 配置信息：");
      resolve(createRedis(path));
    }
  });
};

/**
 * @description 创建base配置文件
 */
export const createBase = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    const base = await inquirer.prompt([
      {
        type: "Password",
        message: "请输入 CDN 链接：",
        name: "cdnUrl",
        mask: "*",
        default: "/",
      },
      {
        type: "Input",
        message: "请输入用于对称加密的默认 key 值 (32位,只允许大小字母数字)：",
        name: "crypto.key",
        default: common.UUID(""),
        validate: (value) => {
          return /^[A-Za-z0-9]{32}$/.test(value) || "格式错误";
        },
      },
      {
        type: "Input",
        message: "请输入用于对称加密的默认 iv 值 (16位,只允许大小字母数字)：",
        name: "crypto.iv",
        default: common.UUID("").substring(0, 16),
        validate: (value) => {
          return /^[A-Za-z0-9]{16}$/.test(value) || "格式错误";
        },
      },
      {
        type: "Input",
        message:
          "请输入用于非对称加密的默认 salt 值 (不允许为空，只允许大小字母数字)：",
        name: "crypto.salt",
        default: common.UUID(""),
        validate: (value) => {
          return /^[A-Za-z0-9]+$/.test(value) || "格式错误";
        },
      },
    ]);
    fs.writeFileSync(path, JSON.stringify(base, null, 4));
    logger.info(`已生成 base 配置,位置：${path}`);
    await common.sleep(1000);
    resolve(true);
  });
};
