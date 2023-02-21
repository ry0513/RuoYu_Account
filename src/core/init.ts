import fs from "fs-extra";

import "./common";
import "./log";
import "./verify";
import { createMysql, createRedis, createBase } from "./configCreate";
import { mysqlInit, sequelizeRun } from "../db/sequelize";
import { redisRun } from "../redis/redis";
export default async () => {
  const getPath = (path: string) =>
    common.path(__dirname, `../../config/${path}.json`);
  // 创建配置文件夹,不存在则创建
  const PATH_CONFIG = common.path(__dirname, "../../config");
  if (!fs.existsSync(PATH_CONFIG)) fs.mkdirSync(PATH_CONFIG);

  // 检测配置文件是否存在
  // MYSQL - 数据库
  const PATH_MYSQL = getPath("mysql");
  if (!fs.existsSync(PATH_MYSQL)) {
    logger.error("缺少 MYSQL 配置文件，请输入信息");
    await createMysql(PATH_MYSQL);
  }
  // REDIS - 缓存
  const PATH_REDIS = getPath("redis");
  if (!fs.existsSync(PATH_REDIS)) {
    logger.error("缺少 REDIS 配置文件，请输入信息");
    await createRedis(PATH_REDIS);
  }
  // BASE - 缓存
  const PATH_BASE = getPath("base");
  if (!fs.existsSync(PATH_BASE)) {
    logger.error("缺少 BASE 配置文件，请输入信息");
    await createBase(PATH_BASE);
  }

  // 运行
  common.baseConfig = (await common.import(PATH_BASE)) as BaseConfig;
  await sequelizeRun((await common.import(PATH_MYSQL)) as mysqlConfig);
  await redisRun((await common.import(PATH_REDIS)) as redisConfig);

  await mysqlInit();

  // 延迟1秒
  await common.sleep(1000);
};
