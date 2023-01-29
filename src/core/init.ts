import fs from "fs-extra";

import "./common";
import "./log";
import { createMysql, createRedis } from "./configCreate";
import { mysqlInit, sequelizeRun } from "../db/sequelize";
import { redisRun } from "../redis/redis";
export default async () => {
  // 创建配置文件夹,不存在则创建
  const PATH_CONFIG = common.path(__dirname, "../../config");
  if (!fs.existsSync(PATH_CONFIG)) fs.mkdirSync(PATH_CONFIG);

  // 检测配置文件是否存在
  // MYSQL
  const PATH_MYSQL = common.path(__dirname, "../../config/mysql.json");
  if (!fs.existsSync(PATH_MYSQL)) {
    logger.error("缺少 MYSQL 配置文件，请输入信息");
    await createMysql(PATH_MYSQL);
  }
  // REDIS
  const PATH_REDIS = common.path(__dirname, "../../config/redis.json");
  if (!fs.existsSync(PATH_REDIS)) {
    logger.error("缺少 REDIS 配置文件，请输入信息");
    await createRedis(PATH_REDIS);
  }

  // 运行
  // MYSQL
  await sequelizeRun((await common.import(PATH_MYSQL)) as mysqlConfig);
  await mysqlInit();
  await redisRun((await common.import(PATH_REDIS)) as redisConfig);

  // 延迟1秒
  await common.sleep(1000);
};
