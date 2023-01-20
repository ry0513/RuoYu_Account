import express from "express";

// 初始化 Express 框架
const app = express();

// 启动服务
app.listen(4000, "0.0.0.0", () => {
  console.log(`HTTP 模块: [ http://127.0.0.1:4000 ]`);
});
