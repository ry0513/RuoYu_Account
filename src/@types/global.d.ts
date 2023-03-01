declare module globalThis {
  var common: Common;
  var logger: loggerFun;
  var sequelize: import("sequelize-typescript").Sequelize;
  var redis: import("redis").RedisClient;
  var joi: import("joi").Root;
  var verify: (
    property: "body" | "query",
    schema: import("joi").PartialSchemaMap<any>,
    callback?: Function
  ) => (
    req: import("express").Request,
    res: import("express").Response,
    next: import("express").NextFunction
  ) => void;
}

interface loggerFun {
  info: (msg: string) => void;
  error: (msg: string, err?: { message: string }) => void;
}

interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface RedisConfig {
  port: number;
  host: string;
  password: string;
  db?: string;
}
interface MapConfig {
  serve: string;
  key: string;
  sk: string;
}
type RequestGet = { [key: string]: any };

type RY_Pick<T, K extends keyof T> = {
  [P in K]?: T[P];
};

type RY_Array<T, K extends keyof T> = Array<K>;
