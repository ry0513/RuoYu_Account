import Apps from "../modles/Apps";

/**
 * @description 获取App信息
 * @returns 默认：appId，appName
 */
export const getApp = (
  where: RY_Pick<Apps, "appId" | "clientKey" | "serveKey">,
  attributes: RY_Array<Apps, "accountId" | "clientKey" | "serveKey"> = []
) => {
  return Apps.findOne({
    attributes: ["appId", "appName", ...attributes],
    where,
  });
};
