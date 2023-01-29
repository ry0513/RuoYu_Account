import inquirer from "inquirer";
import fs from "fs-extra";

import { mysqlTest } from "../db/sequelize";
import { redisTest } from "../redis/redis";

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
        type: "Input",
        message: "请输入密码：",
        name: "password",
      },
    ]);
    logger.info("开始测试 MYSQL 信息");
    if (await mysqlTest(mysql)) {
      fs.writeFileSync(path, JSON.stringify(mysql, null, 4));
      logger.info(`已生成 MYSQL 配置,位置：${path}`);
      resolve(true);
    } else {
      logger.info("请重新输入 MYSQL 配置信息：");
      createMysql(path);
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
        type: "Input",
        message: "请输入端口号：",
        name: "port",
        default: 6379,
      },
      {
        type: "Input",
        message: "请输入密码：",
        name: "password",
      },
    ]);
    logger.info("开始测试 REDIS 信息");

    if (await redisTest(redis)) {
      fs.writeFileSync(path, JSON.stringify(redis, null, 4));
      logger.info(`已生成 REDIS 配置,位置：${path}`);
      resolve(true);
    } else {
      logger.info("请重新输入 REDIS 配置信息：");
      createRedis(path);
    }
  });
};
