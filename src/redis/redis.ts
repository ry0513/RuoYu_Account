import { createClient } from "redis";

export const redisRun = async ({ port, host, password, db }: redisConfig) => {
  return new Promise((resolve) => {
    global.redis = createClient({ port, host, password, db });
    redis
      .on("ready", () => {
        logger.info("REDIS 模块: 连接正常");
        redisListen({ port, host, password, db });
        resolve(true);
      })
      .on("error", (err) => {
        logger.error("REDIS 模块: 连接异常", err);
        common.exit();
      });
  });
};

export const redisTest = async ({ port, host, password }: redisConfig) => {
  return new Promise<number | false>((resolve) => {
    createClient({ port, host, password })
      .on("ready", () => {
        logger.info("REDIS 模块: 连接正常");
      })
      .on("error", (err) => {
        logger.error("REDIS 模块: 服务异常", err);
        resolve(false);
      })
      .sendCommand(
        "config",
        ["get", "databases"],
        (err, data: [string, number]) => {
          resolve(data[1]);
        }
      );
  });
};

// 监听 redis 过期
const redisListen = ({ port, host, password, db }: redisConfig) => {
  const redisSub = createClient({ port, host, password, db });
  redisSub.send_command(
    "config",
    ["set", "notify-keyspace-events", "Ex"],
    () => {
      redisSub.subscribe(`__keyevent@${db}__:expired`, () => {
        redisSub.on("message", (chan, key) => {
          if (key.indexOf("RY_TOKEN:") === 0) {
            // 确认过期的是 登录信息
            redisDelAccount({
              redisId: key.replace("RY_TOKEN:", "RY_TOKEN_CONNECT:"),
            });
          }
        });
      });
    }
  );
};

// 删除指定信息
export const redisDelAccount = ({
  accountId = "*",
  redisId = "*",
}): Promise<boolean> => {
  return new Promise((resolve) => {
    redis.keys(`${accountId}-user-${redisId}`, (err, data) => {
      data.forEach((key) => {
        redis.get(key, (err, val) => {
          if (val) {
            redis.del(val);
          }
        });
      });
      resolve(true);
    });
  });
};

// 创建uid-cookie关联
export const redisSetAccount = (
  accountId: number,
  redisId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    redis.set(
      `RY_TOKEN_CONNECT:${accountId}-user-${redisId}`,
      JSON.stringify({ longinTime: new Date() }),
      () => {
        resolve(true);
      }
    );
  });
};
