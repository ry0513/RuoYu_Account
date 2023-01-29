import { createClient } from "redis";

export const redisRun = async ({ port, host, password }: redisConfig) => {
  return new Promise((resolve) => {
    global.redis = createClient(port, host, {
      password,
    });
    redis
      .on("ready", () => {
        logger.info("REDIS 模块: 连接正常");
        redisListen({ port, host, password })
        resolve(true);
      })
      .on("error", (err) => {
        logger.error("REDIS 模块: 连接异常", err);
        common.exit();
      });

  });
};

export const redisTest = async ({ port, host, password }: redisConfig) => {
  return new Promise((resolve) => {
    createClient(port, host, {
      password,
    })
      .on("ready", () => {
        logger.info("REDIS 模块: 连接正常");
        resolve(true);
      })
      .on("error", (err) => {
        logger.error("REDIS 模块: 服务异常", err);
        resolve(false);
      });
  });
};


const redisListen = ({ port, host, password }: redisConfig) => {
  const redisSub = createClient(port, host, {
    password,
  });
  redisSub.send_command("config", ["set", "notify-keyspace-events", "Ex"], () => {
    redisSub.subscribe("__keyevent@0__:expired", () => {
      redisSub.on("message", (chan, key) => {
        redisDelAccount({ redisId: key });
      });
    });
  });

}

export const redisDelAccount = (
  { accountId = "*", redisId = "*" }
): Promise<boolean> => {
  return new Promise((resolve) => {
    redis.keys(`${redisId}-user-${accountId}`, (err, data) => {
      console.log(data);
      data.forEach((key) => {
        redis.get(key, (err, val) => {
          if (val) redis.del(val);
          redis.del(key);
        });
      });
      resolve(true);
    });
  });
};