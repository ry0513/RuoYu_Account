import "express-session";
declare module "express-session" {
    interface Session {
        /**
         * @description 账号信息
         */
        account: {
            accountId: number;
            // nickName: string;
            // email: string;
            // phone: number;
            // avatar: string;
        };
    }
}
