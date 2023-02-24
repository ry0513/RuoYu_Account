import { Request } from "express";
import axios from "axios";
// import RUOYU from "./ruoyu";
import UAParser from "ua-parser-js";

/**
 * @description 获取IP
 */
export const getIp = (req: Request) => {
  return req.ips[0] || req.ip || "未知";
};

/**
 * @description 获取地址
 */
export const getCity = (
  ip: string,
  {
    serve = common.map.serve,
    key = common.map.key,
    sk = common.map.sk,
    isTest = false,
  } = {}
) => {
  return new Promise<string>((resolve) => {
    if (serve === "txdt") {
      axios({
        method: "get",
        url: `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${key}&sig=${common.encryption.md5(
          `/ws/location/v1/ip?ip=${ip}&key=${key}${sk}`
        )}`,
      }).then(({ data }) => {
        if (data.status === 0) {
          const { city, district } = data.result.ad_info;
          resolve(city + district);
        } else {
          if (isTest) {
            resolve("error");
          } else {
            resolve("未知");
          }
        }
      });
    } else {
      resolve("未知");
    }
  });
};

/**
 * @description 格式化UA数据
 */
export const getUa = (
  ua = ""
): {
  ua: string;
  os: string | null;
  browser: string | null;
  device: string | null;
} => {
  const uaInfo = UAParser(ua);
  const browser =
    `${uaInfo.browser.name || ""} ${uaInfo.browser.version || ""}`.trim() ||
    null;
  const os =
    `${uaInfo.os.name || ""} ${uaInfo.os.version || ""}`.trim() || null;
  const device = uaInfo.device.model || null;
  return { ua, os, browser, device };
};
