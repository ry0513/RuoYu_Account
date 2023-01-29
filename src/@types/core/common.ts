interface Common {
  /**
   * 休眠函数
   * @param ms 毫秒
   */
  sleep: (ms: number) => Promise<void>;

  /**
   * 引入文件
   * @param path 路径
   */
  import: (path: string) => Promise<any>;

  /**
   * 获取绝对路径
   * @param path 路径
   */
  path: (...path: string[]) => string;

  /**
   * 退出函数
   */
  exit: () => Promise<void>;

  /**
   * 密码加密
   */
  md5Pass: (val: string, md5Val: string) => string;

  /**
   * md5加密
   */
  md5: (val: string) => string;
}
