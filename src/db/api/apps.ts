import Apps from "../modles/Apps";
// export const getUser = (
//     where: { accountId?: number; email?: string },
//     attributes: string[] = []
// ) => {
//     return Account.findOne({
//         attributes: ["accountId", "nickName", "email", "phone", "avatar", "status", ...attributes],
//         where,
//     });
// };

export const getApp = (
  where: { appId?: number; clientKey?: string; serveKey?: string },
  attributes: string[] = []
) => {
  return Apps.findOne({
    attributes: ["appId", "appName", ...attributes],
    where,
  });
};
