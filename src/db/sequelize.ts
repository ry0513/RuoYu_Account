import { Sequelize } from "sequelize-typescript";

import Account from "./modles/Account";
import App from "./modles/Apps";
import Record from "./modles/Record";
export const sequelizeRun = ({
  host,
  port,
  database,
  user,
  password,
}: MysqlConfig) => {
  return new Promise((resolve) => {
    global.sequelize = new Sequelize(database, user, password, {
      host,
      port,
      dialect: "mysql",
      timezone: "+08:00",
      pool: {
        max: 20,
        min: 0,
        idle: 10000,
      },
      logging: false,
      define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        underscored: true,
      },
      models: [common.path(__dirname, "./modles/")],
    });
    sequelize
      .authenticate()
      .then(() => {
        logger.info("MYSQL 模块: 连接正常");
        resolve(true);
      })
      .catch((err) => {
        logger.error("MYSQL 模块: 连接异常", err);
        common.exit();
      });
  });
};

export const mysqlInit = () => {
  return new Promise(async (resolve) => {
    logger.info("MYSQL 模块: 开始初始化");
    await sequelize.sync({ force: false, alter: true });
    await Account.findOrCreate({
      where: {
        accountId: 10001,
      },
      defaults: {
        accountId: 10001,
        nickName: "超级管理员",
        password: common.encryption.encryptAsym("ruoyu"),
        email: "ruoyu@xxx.com",
        status: 1,
        salt: common.baseConfig.crypto.salt,
        avatar:
          "https://pica.zhimg.com/80/v2-d181474a2481c290898cf7d183b41a7e_720w.jpg?source=1940ef5c",
      },
    });
    logger.info("MYSQL 模块: 结束初始化");
    resolve(true);
  });
};

export const mysqlTest = ({
  host,
  port,
  database,
  user,
  password,
}: MysqlConfig) => {
  return new Promise((resolve, reject) => {
    new Sequelize(database, user, password, {
      host,
      port,
      dialect: "mysql",
      logging: false,
    })
      .authenticate()
      .then(() => {
        logger.info("MYSQL 模块: 连接正常");
        resolve(true);
      })
      .catch((err) => {
        logger.error("MYSQL 模块: 连接异常", err);
        resolve(false);
      });
  });
};
