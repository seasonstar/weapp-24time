const LRUCache = require('./lru.js')
const Retry = require('./retry.js');
const qcloud = require('../vendor/qcloud-weapp-client-sdk/index');
import { encodeQuery } from './misc.js';
import config from '../config';

let cache = new LRUCache();

/*
 *    REST API
 */
export const request = (method = 'GET') => (url, data = {}, options = {}) => {
  if (options.toast) {
    wx.showToast({
      title: options.toast.title || '加载中',
      icon: 'loading',
      duration: options.toast.duration || 10000,
    })
  }

  let cacheKey;
  return new Promise((resolve, reject) => {
    if (options.cache) {
      cacheKey = encodeQuery(url, data);
      let cacheData = cache.get(cacheKey);
      if (cacheData) {
        resolve(cacheData);
        return false;
      }
    }

    let retry = new Retry({
      timeout: 8000,           // 超时时间，默认不会超时
      interval: 200,           // 每次执行的时间间隔，默认是0
      max: options.max || 3,        // 最大重试次数，默认是无穷大
      done: function(data) {
        // 成功
        resolve(data);
      },
      fail: function(err) {
        // 失败
        reject(err);
      }
    });

    retry.start((done, retry) => {
      qcloud.request({
        url,
        login: options.login, // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
        data,
        method,
        success: function(res) {
          if (options.cache) {
            cache.set(cacheKey, res.data);
          }
          resolve(res.data);
        },
        fail: function(err) {
          reject(err);
        },
        complete() {
          console.log('request complete');
        }
      });
    })
  })
}

const GET = request('GET');
const POST = request('POST');
const PUT = request('PUT');
const DEL = request('DELETE');

/*
 *    定位接口
 */
const GETLOCATION = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        resolve({ latitude: res.latitude, longitude: res.longitude });
      },
      fail: function(res) {
        reject(res);
      },
      complete: function(values) {
        if (values.errMsg.indexOf('cancel') !== -1) {
          reject(values);
        } else {
          resolve(values);
        }
      }
    })
  })
}

/**
 * 上传方法
 * filePath: 上传的文件路径
 * fileName： 上传到cos后的文件名
 */

const UPLOAD = (filePath, fileName) => {

  const cosUrl = `${config.service.cosUrl}`;
  const cosSignatureUrl = `${config.service.cosSignatureUrl}`;

  return new Promise((resolve, reject) => {
      // 鉴权获取签名
    wx.request({
      url: cosSignatureUrl,
      success: (cosRes) => {
        // 头部带上签名，上传文件至COS
        wx.uploadFile({
          url: `${cosUrl}/${fileName}`,
          filePath: filePath,
          header: { 'Authorization': cosRes.data },
          name: 'filecontent',
          formData: { op: 'upload' },
          success: (uploadRes) => {
            console.log(uploadRes);
            resolve(uploadRes.data);
            // do something
          },
          fail: (err) => {
            console.error(err);
            reject(err);
          }
        });
      }
    })
  })
}

module.exports = {
  GET,
  PUT,
  POST,
  DEL,
  GETLOCATION,
  UPLOAD,
}
