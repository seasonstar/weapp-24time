import * as API from './request';
import config from '../config';
import timeago from './timeago';

const HOST = `${config.service.host}`;

// 显示失败提示
let showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

function fetchPosts(schoolId, params) {
  return API.GET(
      `${HOST}/v1/posts/schools/${schoolId}`,
      params,
      {cache: false},
    )
    .then(res => {
      let data = res.data
      if (res.code !== 0) {
        showModel('好像出问题了', res);
        return;
      }
      let postList = data.posts;
      postList.map(item => {
        item.createdAt = timeago(item.createdAt);
      });
      data.posts = postList;
      return data
    })
}

function fetchSchools() {
  return API.GET(
      `${HOST}/v1/schools`,
      {},
      {cache: true},
    )
    .then(res => {
      let data = res.data
      if (res.code !== 0) {
        showModel('好像出问题了', res);
        return;
      }
      let schoolList = [];
      data.schools.forEach(item => {
        schoolList.push.apply(schoolList, item.data);
      })
      console.log(schoolList);
      data.schoolList = schoolList;
      return data
    })
}

function fetchPostDetail(postId) {
  return API.GET(
      `${HOST}/v1/posts/${postId}`,
      {},
      {cache: false},
    )
    .then(res => {
      let data = res.data;
      if (res.code !== 0) {
        showModel('好像出问题了', res);
        return;
      }
      let comments = data.comments;
      comments.map(item => {
        item.createdAt = timeago(item.createdAt);
      });
      data.comments = comments;
      data.post.createdAt = timeago(data.post.createdAt);
      return data
    })
}

function deletePost(postId) {
  return API.DEL(
      `${HOST}/v1/posts/${postId}`,
    )
    .then(res => {
      if (res.code !== 0) {
        showModel('', res);
        return;
      }
      return;
    })
}

function createPost(params) {
  return API.POST(
      `${HOST}/v1/posts`,
      params,
    )
    .then(data => {
      return data
    })
}

function likePost(postId) {
  return API.POST(
      `${HOST}/v1/posts/${postId}/like`,
    )
    .then(data => {
      return data.data
    })
}

function reportPost(postId, params) {
  return API.POST(
      `${HOST}/v1/posts/${postId}/report`,
      params,
    )
    .then(data => {
      return data
    })
}

function commentPost(postId, params) {
  return API.POST(
      `${HOST}/v1/posts/${postId}/comment`,
      params
    )
    .then(data => {
      return data
    })
}

function replyComment(postId, commentId, params) {
  return API.POST(
      `${HOST}/v1/posts/${postId}/comment/${commentId}/reply`,
      params
    )
    .then(data => {
      return data
    })
}

function likeComment(postId, commentId, params) {
  return API.POST(
      `${HOST}/v1/posts/${postId}/comment/${commentId}/like`,
      params
    )
    .then(data => {
      return data
    })
}

module.exports = {
  fetchPosts,
  fetchSchools,
  fetchPostDetail,
  deletePost,
  createPost,
  likePost,
  reportPost,
  commentPost,
  replyComment,
  likeComment,
}
