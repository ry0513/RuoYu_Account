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
export const getCity = (ip: string) => {
  return new Promise<string>((resolve) => {
    resolve("未知");
    // axios({
    //     method: "get",
    //     url: `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY
    //         }&sig=${RUOYU.md5(
    //             `/ws/location/v1/ip?ip=${ip}&key=${RUOYU.TXDT.KEY}${RUOYU.TXDT.SK}`
    //         )}`,
    // }).then(({ data: res }) => {
    //     if (res.status) {
    //         resolve("未知地区");
    //     } else {
    //         const { city, district } = res.result.ad_info;
    //         resolve(`${city}${district}`);
    //     }
    // });
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
