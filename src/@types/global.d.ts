declare module globalThis {
  var common: Common;
  var logger: loggerFun;
  var sequelize: import("sequelize-typescript").Sequelize;
  var redis: import("redis").RedisClient;
}

interface loggerFun {
  info: (msg: string) => void;
  error: (msg: string, err?: { message: string }) => void;
}

interface mysqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface redisConfig {
  port: number;
  host: string;
  password: string;
}
