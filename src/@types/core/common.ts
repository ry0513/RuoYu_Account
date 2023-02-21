interface BaseConfig {
  /**
   * @description cdn链接
   */
  cdnUrl: string;

  /**
   * @description crypto 对称加密
   */
  crypto: {
    key: string;
    iv: string;
    salt: string;
  };
}

interface ResponseFun {
  /**
   * @description 返回成功
   */
  success: (res: import("express").Response, obj?: object) => void;
  /**
   * @description 参数错误
   */
  parameter: (res: import("express").Response, obj?: object) => void;
  /**
   * @description 需要登录
   */
  needLogin: (res: import("express").Response, obj?: object) => void;
  /**
   * @description 权限不足
   */
  permission: (res: import("express").Response, obj?: object) => void;
  /**
   * @description 其他错误
   */
  error: (res: import("express").Response, obj?: object) => void;
}

interface Rules {
  /**
   * @description 校验密码
   */
  passWord: {
    reg: RegExp;
    msg: string;
  };
}

interface Encryption {
  /**
   * 对称加密
   */
  encrypt: (val: string, key?: string, iv?: string) => string;
  /**
   * 对称解密
   */
  decrypt: (val: string, key?: string, iv?: string) => string | null;
  /**
   * 非对称加密
   */
  encryptAsym: (val: string, salt?: string) => string;
}

interface Common {
  /**
   * @description 基本配置
   */
  baseConfig: BaseConfig;

  /**
   * @description 生成uuid
   * @param _ 分隔符
   */
  UUID: (_?: string) => string;

  /**
   * @description 休眠函数
   * @param ms 毫秒
   */
  sleep: (ms: number) => Promise<void>;

  /**
   * @description 引入文件
   * @param path 路径
   */
  import: (path: string) => Promise<any>;

  /**
   * @description 获取绝对路径
   * @param path 路径数组
   */
  path: (...path: string[]) => string;

  /**
   * 退出函数
   */
  exit: () => Promise<void>;

  /**
   * @description 请求返回函数
   */
  res: ResponseFun;

  /**
   * @description 正则表达式规则
   */
  rules: Rules;

  /**
   * @description 加密解密
   */
  encryption: Encryption;
}
