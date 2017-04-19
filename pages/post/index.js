import { fetchPostDetail, likePost, likeComment, replyComment, deletePost, reportPost } from '../../utils/api';

let app = getApp();

Page({

  data: {
    postId: null,
    post: {},
    comments: [],
    userInfo: {},
  },

  onLoad(option) {
    const postId = option.postid;
    this.setData({
      postId,
      userInfo: app.globalData.userInfo,
    });
  },

  onShow() {
    fetchPostDetail(this.data.postId).then(res => {
      this.setData({
        post: res.post,
        comments: res.comments,
      })
    })
  },

  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.post.images.map(i => i.url)
    })
  },

  comment() {
    wx.navigateTo({
      url: '../publish/index?postId=' + this.data.postId,
    })
  },

  showActions() {
    let postid = this.data.post.id;
    let postuser = this.data.post.user.id;
    let itemList = ['举报'];
    let has_perm = postuser == this.data.userInfo.id || this.data.userInfo.inChargeOf.indexOf(this.data.post.school.id) > -1;
    if (has_perm) {
      itemList.push('删除');
    }
    wx.showActionSheet({
      itemList,
      success(res) {
        if (res.tapIndex == 0) {
          reportPost(postid, {subject: "不良信息"});
          wx.showToast({
            title: '感谢您的举报',
            icon: 'success'
          });
        } else if (res.tapIndex == 1) {
          wx.showModal({
            title: '确定删除?',
            content: '',
            success: function(res) {
              if (res.confirm) {
                deletePost(postid).then(() => {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success'
                  });
                  wx.navigateBack();
                });
              } else if (res.cancel) {
              }
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  reply_comment() {
    replyComment(this.data.post.id).then(res => {
      console.log(res)
    })
  },

  like_post() {
    let post = this.data.post
    likePost(post.id).then(res => {
      post.num_likes = res.favor ? post.num_likes + 1 : post.num_likes - 1;
      post.is_liked = res.favor && true;
      this.setData({ post: post });
    })
  },

  like_comment() {
    likeComment(this.data.post.id).then(res => {
      console.log(res)
    })
  },


});
