## weapp-24time


微信小程序 社区系统全栈解决方案

> [egg-24time](https://github.com/seasonstar/egg-24time)

社区后端使用Egg，Mysql，Redis，基于Nodejs开发，全套代码使用ES6编写

> [weapp-24time](https://github.com/seasonstar/weapp-24time)

微信小程序端

------------------------

本示例包含：

1. 微信小程序登录示例
2. 进行带会话的网络请求示例
2. 基于腾讯云COS上传图片或文件的示例
3. 发送帖子，点赞，举报，删除帖子示例

## 源码简介

`app.js` 是小程序入口文件。

`app.json` 是小程序的微信配置。

`config.js` 是我们小程序自己的业务配置。

> 文件目录：

```tree
Demo
├── LICENSE
├── README.md
├── app.js
├── app.json
├── bower.json
├── config.js
├── package.json
├── pages
│   ├── school      分类页面
│   ├── post        帖子详情页面
│   ├── publish     发布页面
│   └── index       首页
│  
├── utils
│   ├── api.js      后端接口数据处理中心
│   ├── lru.js      临时缓存淘汰算法
│   ├── misc.js     各类功能函数集合
│   ├── retry.js    请求失败重试插件
│   ├── request.js  各类微信接口异步定义
│   └── timeago.js  仿微博时间处理插件
│
├── images          图片文件夹
└── vendor
    └── qcloud-weapp-client-sdk/    腾讯云微信小程序SDK
```

## 截图

![](http://785i8w.com1.z0.glb.clouddn.com/WechatIMG4.jpeg?imageView/2/w/200)
![](http://785i8w.com1.z0.glb.clouddn.com/WechatIMG3.jpeg?imageView/2/w/200)
![](http://785i8w.com1.z0.glb.clouddn.com/WechatIMG2.jpeg?imageView/2/w/200)
![](http://785i8w.com1.z0.glb.clouddn.com/WechatIMG1.jpeg?imageView/2/w/200)


## 感谢

[腾讯云微信小程序客户端 SDK](https://github.com/tencentyun/weapp-client-sdk)。

[微信小程序会话管理-客户端](https://github.com/CFETeam/weapp-session-client)。

[WeCOS-UGC-DEMO资源上传示例](https://github.com/tencentyun/wecos-ugc-upload-demo)。

感谢以上项目的一些参考和启发
