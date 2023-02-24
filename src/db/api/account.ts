import Account from "../modles/Account";

/**
 * @description 获取用户信息
 * @returns 默认：accountId，nickName，avatar
 */
export const getUser = (
  where: { accountId?: number; email?: string },
  attributes: string[] = []
) => {
  return Account.findOne({
    attributes: ["accountId", "nickName", "avatar", ...attributes],
    where,
  });
};
