/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
const host = 'http://127.0.0.1:7001';

/**
 * 把以下字段替换成自己的cos相关信息，详情可看API文档 https://www.qcloud.com/document/product/436/6066
 * REGION: cos上传的地区
 * APPID: 账号的appid
 * BUCKET_NAME: cos bucket的名字
 * DIR_NAME: 上传的文件目录
 * cosSignatureUrl：填写自己的鉴权服务器地址，查看前面的[准备工作]
 */
const REGION = "sh";
const APPID = "";
const BUCKET_NAME = "";
const DIR_NAME = "";

const config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    loginUrl: `${host}/login`,
    cosUrl: `https://${REGION}.file.myqcloud.com/files/v2/${APPID}/${BUCKET_NAME}/${DIR_NAME}`,
    cosSignatureUrl: `${host}/cos_auth`

  },
};

module.exports = config;
