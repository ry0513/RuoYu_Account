import Account from "../modles/Account";

/**
 * @description 获取用户信息
 * @returns 默认：accountId，nickName，avatar
 */
export const getUser = (
  where: RY_Pick<Account, "accountId" | "email">,
  attributes: RY_Array<
    Account,
    "email" | "phone" | "status" | "registerIp" | "registerPlace" | "salt"
  > = []
) => {
  return Account.findOne({
    attributes: ["accountId", "nickName", "avatar", ...attributes],
    where,
  });
};
