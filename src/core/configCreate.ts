import inquirer from "inquirer";
import fs from "fs-extra";

import { mysqlTest } from "../db/sequelize";
import { redisTest } from "../redis/redis";

import Rx from "rxjs/Rx";
import { getCity } from "./tools";

/**
 * @description 创建 mysql 配置文件
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
 * @description 创建 redis 配置文件
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
            type: "rawlist",
            message: "请选择数据库",
            name: "db",
            choices: () => {
              const list = [];
              for (let i = 0; i < size; i++) {
                list.push({ value: i, name: `db${i}` });
              }
              return list;
            },
          },
        ])
      ).db;
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
 * @description 创建 base 配置文件
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

/**
 * @description 创建 map 配置文件
 */
export const createMap = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    const map: MapConfig = await (() => {
      return new Promise((resolve, reject) => {
        const prompts = new Rx.Subject();
        const map: { [key: string]: string } = {};
        inquirer.prompt(prompts).ui.process.subscribe(
          async (res) => {
            map[res.name] = res.answer;
            if (res.name === "serve" && res.answer !== "") {
              prompts.next({
                type: "Input",
                message: "请输入地图API的 key 值：",
                name: "key",
              });
              prompts.next({
                type: "Input",
                message: "请输入地图API的 Secret key 值：",
                name: "sk",
              });
            }
            prompts.complete();
          },
          (error) => {
            logger.error("MAP 配置失败");
          },
          () => {
            resolve(map as unknown as MapConfig);
          }
        );
        prompts.next({
          type: "list",
          message: "请选择地图 Api 服务",
          name: "serve",
          choices: [
            { value: "", name: "不启用" },
            { value: "txdt", name: "腾讯地图" },
          ],
        });
      });
    })();
    logger.info("开始测试 MAP 信息");

    if (!map.serve) {
      fs.writeFileSync(path, JSON.stringify(map, null, 4));
      logger.info("MAP 模块: 无需测试");
      logger.info(`已生成 MAP 配置,位置：${path}`);
      await common.sleep(1000);
      resolve(true);
    } else if (
      (await getCity("123.123.123.123", { ...map, isTest: true })) !== "error"
    ) {
      logger.info("MAP 模块: 调用成功");
      fs.writeFileSync(path, JSON.stringify(map, null, 4));
      logger.info(`已生成 MAP 配置,位置：${path}`);
      await common.sleep(1000);
      resolve(true);
    } else {
      logger.error("MAP 模块: 调用失败");
      logger.info("请重新输入 MAP 配置信息：");
      await common.sleep(1000);
      resolve(createMap(path));
    }
  });
};
