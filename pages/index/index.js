import { fetchPosts, likePost, deletePost, reportPost } from '../../utils/api';

const PAGE_SIZE = 12;
let app = getApp();

Page({

  data: {
    page: 0,
    posts: [],
    school: {},
    schoolId: wx.getStorageSync('my_school') || 1,
    hasMore: true,
    loadingMore: false,
    refreshing: false,
    userInfo: {},
  },

  onLoad() {
    const page = this.data.page;
    this.setData({
      loadingMore: true,
      schoolId: wx.getStorageSync('my_school') || 1,
    });
    fetchPosts(this.data.schoolId, { page, page_size: PAGE_SIZE }).then(res => {
      this.setData({
        page: page + 1,
        school: res.school,
        posts: res.posts,
        hasMore: res.posts.length >= PAGE_SIZE,
        loadingMore: false,
        userInfo: app.globalData.userInfo,
      })
    })
  },


  onShow() {
    const needRefresh = wx.getStorageSync('needRefresh');
    if (!needRefresh) return;

    this.setData({
      loadingMore: true,
      schoolId: wx.getStorageSync('my_school') || 1,
    });
    fetchPosts(this.data.schoolId, { page: 0, page_size: PAGE_SIZE }).then(res => {
      this.setData({
        page: 1,
        school: res.school,
        posts: res.posts,
        hasMore: res.posts.length >= PAGE_SIZE,
        loadingMore: false,
        userInfo: app.globalData.userInfo,
      })
    })
  },

  onHide() {
    const needRefresh = wx.getStorageSync('needRefresh');
    if (!needRefresh) return;

    this.setData({
      page: 0,
      hasMore: true,
      loadingMore: false,
    })
    wx.removeStorageSync('needRefresh');
  },

  onRefresh() {
    if (this.data.refreshing) return;
    wx.showToast({
      title: '正在刷新...',
      icon: 'loading'
    });
    this.setData({refreshing: true});
    fetchPosts(this.data.schoolId, { page: 0, page_size: PAGE_SIZE }).then(res => {
      this.setData({
        page: 1,
        school: res.school,
        posts: res.posts,
        hasMore: true,
        loadingMore: false,
        refreshing: false,
      })
      wx.hideToast();
    })
  },

  loadMore(e) {
    const { page, loadingMore, hasMore } = this.data;
    if (!hasMore || loadingMore) return;

    this.setData({ loadingMore: true });
    fetchPosts(this.data.schoolId, { page, page_size: PAGE_SIZE }).then(res => {
      this.setData({
        page: page + 1,
        school: res.school,
        posts: this.data.posts.concat(res.posts),
        hasMore: res.posts.length >= PAGE_SIZE,
        loadingMore: false,
      })
    })
  },

  previewImage(e) {
    let { src, postid } = e.currentTarget.dataset;
    wx.previewImage({
      current: src,
      urls: this.data.posts.filter(p => p.id === postid)[0].images.map(i => i.url)
    })
  },

  switchSchool(e) {
    let { schoolid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../school/index?schoolId=' + schoolid,
    })
  },

  comment(e) {
    let { postid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../post/index?postid=' + postid,
    })
  },

  showActions(e) {
    let { postid, postuser } = e.currentTarget.dataset;
    let itemList = ['举报'];
    let has_perm = postuser == this.data.userInfo.id || this.data.userInfo.inChargeOf.indexOf(this.data.school.id) > -1;
    if (has_perm) {
      itemList.push('删除');
    }
    let that = this;
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
                  let postList = that.data.posts.filter(item => {
                    return item.id != postid;
                  })
                  that.setData({posts: postList});
                  wx.showToast({
                    title: '已删除',
                    icon: 'success'
                  });
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

  like(e) {
    let { postid } = e.currentTarget.dataset
    likePost(postid).then(res => {
      this.toggleLike(postid, res);
    })
  },

  toggleLike(postid, res) {
    this.data.posts.map(item => {
      if (item.id === postid) {
        item.num_likes = res.favor ? item.num_likes + 1 : item.num_likes - 1;
        item.is_liked = res.favor && true;
      }
    });
    this.setData({ posts: this.data.posts });
  },

  publish(e) {
    let { schoolid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../publish/index?schoolId=' + schoolid,
    })
  },

});
