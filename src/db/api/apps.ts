import Apps from "../modles/Apps";

/**
 * @description 获取App信息
 * @returns 默认：appId，appName
 */
export const getApp = (
  where: { appId?: number; clientKey?: string; serveKey?: string },
  attributes: string[] = []
) => {
  return Apps.findOne({
    attributes: ["appId", "appName", ...attributes],
    where,
  });
};
