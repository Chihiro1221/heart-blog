# 个人博客

![](https://img.shields.io/npm/v/vue?color=%20&label=vue)	![](https://img.shields.io/npm/v/@nestjs/cli?color=%23d73e4b&label=%40nestjs%2Fcli)	![](https://img.shields.io/npm/v/mongoose?label=mongoose)	![](https://img.shields.io/npm/v/vite?color=%239b69f6&label=vite)

在线预览：www.chihiross.com

## ✨ 功能介绍

>  项目主要是前端：Vue3+TS，后端：NestJs+Mongodb构建的一个博客系统。
>
> 包括前端后端完整代码。

### 前端

- 登录表单校验
- 路由游客登录拦截
- 权限过滤菜单
- 自动导入api
- 自动导入组件
- 多端适配（响应式）
- 路由文件模块化管理
- 全局状态管理（comoposables/Pinia）
- TypeScript类型支持
- Vite环境变量
- Vite打包优化
- 全局错误统一拦截处理
- 音乐播放器控件封装
- ...

### 后端

- 通用crud
- 全局配置文件模块
- typegoose数据类型支持
- 文件上传（阿里云oss云存储）
- passport策略（jwt、local）
- 全局错误返回格式统一处理
- 响应结果返回格式统一处理
- swagger文档
- mailter邮件服务
- 多应用模式
- 注册登录（bcrypt、jsonwebtoken）
- 帖子管理
- 分类、标签管理
- 友情链接管理
- 角色、用户、权限管理
- ...

## 👨‍💻 技术栈

### 前端

- 开发框架：Vue、TailwindCss
- 组件库：Element Plus、Ant Design
- 语言拓展：TypeScript、Scss
- 打包构建：Vite
- 代码规范：Prettier

### 后端

- 开发语言：JavaScript
- 开发框架：NestJs
- 数据库：MongoDb
- 对象存储：阿里云OSS
- 中间件：Mailter
- 鉴权：Jwt、Local策略

## 👉 基本使用

### 前端

环境要求：Node.js > 14

> 注意：web是前台项目，admin是后台管理，

安装依赖：

```bash
cd web
yarn
# and
cd admin
yarn
```

开发运行：

```bash
yarn dev
```

打包部署：

```bash
yarn build
```

### 后端

环境要求：

- Node.js > 14
- MongoDb > 4

安装依赖：

```bash
cd server
yarn
```

开发运行：

```bash
nest start server
# and 
nest start admin
```

打包部署：

```bash
# 将同时打包两个应用
yarn build
```

环境变量：

> 注意：本nestjs项目采用的是多应用模式，所以需要同时启动两个应用。（可以自己添加运行脚本）
>
> 请打开`server/libs/common/src/config`中完善配置文件信息

## 项目截图

### 后台

![image-20220512103521843](https://s2.loli.net/2022/05/12/ZNIBXDPRHfxQWtC.png)

![image-20220512104416329](https://s2.loli.net/2022/05/12/AOK8kFbgHDexSum.png)

![image-20220512104438144](https://s2.loli.net/2022/05/12/a2noLQcg3xMjYEm.png)

![image-20220512104452469](https://s2.loli.net/2022/05/12/tYWFNETGJuhdCMH.png)

![image-20220512104512466](https://s2.loli.net/2022/05/12/lE49uZQHVipqCYo.png)

### 前台

![image-20220512104638263](https://s2.loli.net/2022/05/12/J6m8uCIEQ4BpMUa.png)

![image-20220512104848616](https://s2.loli.net/2022/05/12/9mWYRldXhagKjxi.png)

![image-20220512104916266](https://s2.loli.net/2022/05/12/gaPTmJVK495hFyo.png)

![image-20220512105007953](https://s2.loli.net/2022/05/12/ZC2GLvcaHiSBA8U.png)

## 总结

该项目主要是想打造一个完全符合自己技术栈的项目，目前在找工作，希望能有一个亮眼的项目，但感觉实力还是没有发挥完全，不过这个项目总体来将还是很不错的，马上就会上线到实际网站中，欢迎大家来到本网站发布帖子支持我的博客。

也同时希望大家看了我的源码之后能指出问题！

### 联系

- QQ：2213595911
- 博客地址：https://chihiross.com

如果有前端开发过程中的问题欢迎联系我提问👏🏻，也希望能有一些志同道合的朋友们，可以一起在程序员开发的生涯中共同成长，共同进步。
