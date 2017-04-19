import { createPost, commentPost } from '../../utils/api';
import { UPLOAD as uploadFn } from '../../utils/request';

Page({

  data: {
    schoolId: null,
    postId: null,
    images: [],
    access_urls: [],
  },

  onLoad(option) {
    const schoolId = option.schoolId;
    const postId = option.postId;
    this.setData({
      schoolId: schoolId,
      postId
    })
  },

  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.images
    })
  },

  uploadToCos() {
    if (this.data.images.length >= 9) {
      wx.showToast({
        title: '最多上传9张',
        icon: 'success',
      });
      return;
    }
    // 选择上传的图片
    wx.chooseImage({
      success: (res) => {
        // 获取文件路径
        wx.showToast({
          title: '上传中...',
          icon: 'loading',
          duration: 5000
        });
        let filePath = res.tempFilePaths[0];

        // 获取文件名
        let fileName = filePath.match(/(wxfile:\/\/)(.+)/)
        fileName = fileName[2]

        // 文件上传cos，参考上面的核心代码
        uploadFn(filePath, fileName).then(res => {
          const data = JSON.parse(res).data;
          this.data.images.push(filePath);
          this.data.access_urls.push(data.access_url);
          this.setData({
            images: this.data.images,
            access_urls: this.data.access_urls
          });
          wx.hideToast();
        })
      },
      fail: () => {
        wx.hideToast();
      }
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let { is_anonymous, content } = e.detail.value;
    // for 评论
    if (this.data.postId) {
      let params = {
        content: content,
      };
      commentPost(this.data.postId, params).then(res => {
        console.log(res);
        wx.showToast({
          title: "发布成功",
          icon: "success",
          duration: 2000
        });
        wx.setStorageSync('needRefresh', true);
        wx.navigateBack();
      }).catch(() => {
        wx.showToast({
          title: "发布失败",
          duration: 2000
        });
      })
      return;
    };

    // for 树洞
    let params = {
      schoolId: this.data.schoolId,
      content: content,
      is_anonymous: is_anonymous,
      images: this.data.access_urls
    };
    createPost(params).then(res => {
      console.log(res);
      wx.showToast({
        title: "发布成功",
        icon: "success",
        duration: 2000
      });
      wx.setStorageSync('needRefresh', true);
      wx.navigateBack();
    }).catch(() => {
      wx.showToast({
        title: "发布失败",
        duration: 2000
      });
    })
  },

});
