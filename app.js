import qcloud from './vendor/qcloud-weapp-client-sdk/index';
import config from './config';

App({
  /**
   * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
   */
  onLaunch() {
    qcloud.setLoginUrl(config.service.loginUrl);
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
        this.globalData.rpx = res.windowWidth / 750;
      },
      fail: () => { }
    });
    this.doLogin();

  },
  clearSession() {
    // 清除保存在 storage 的会话信息
    qcloud.clearSession();
    console.log('会话已清除', result);
  },
  doLogin() {
    qcloud.login({
      success: result => {
        console.log('登录成功', result);
        this.globalData.userInfo = result;
      },
      fail: (error) => {
        console.log('登录失败', error);
      }
    });
  },
  onShow() {
  },
  onHide() {
    // 锁屏触发事件
  },
  globalData: {
    userInfo: {},
  }
});
