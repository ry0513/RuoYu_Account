import fs from "fs-extra";

import "./common";
import "./log";
import "./verify";
import {
  createMysql,
  createRedis,
  createBase,
  createMap,
} from "./configCreate";
import { mysqlInit, sequelizeRun } from "../db/sequelize";
import { redisRun } from "../redis/redis";
export default async () => {
  const getPath = (path: string) =>
    common.path(__dirname, `../../config/${path}.json`);
  // 创建配置文件夹,不存在则创建
  const PATH_CONFIG = common.path(__dirname, "../../config");
  if (!fs.existsSync(PATH_CONFIG)) fs.mkdirSync(PATH_CONFIG);

  // 检测配置文件是否存在
  // BASE - 基础配置
  const PATH_BASE = getPath("base");
  if (!fs.existsSync(PATH_BASE)) {
    logger.error("缺少 BASE 配置文件，请输入信息");
    await createBase(PATH_BASE);
  }
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
  // MAP - 地图
  const PATH_MAP = getPath("map");
  if (!fs.existsSync(PATH_MAP)) {
    logger.error("缺少 MAP 配置文件，请输入信息");
    await createMap(PATH_MAP);
  }

  // 运行
  common.baseConfig = (await common.import(PATH_BASE)) as BaseConfig;
  common.map = (await common.import(PATH_MAP)) as MapConfig;
  await sequelizeRun((await common.import(PATH_MYSQL)) as MysqlConfig);
  await redisRun((await common.import(PATH_REDIS)) as RedisConfig);

  await mysqlInit();

  // 延迟1秒
  await common.sleep(1000);
};
