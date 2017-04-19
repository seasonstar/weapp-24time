import { fetchSchools } from '../../utils/api';

Page({

  data: {
    schoolId: wx.getStorageSync('my_school') || 1,
    current: null,
    schools: [],
  },

  onLoad(option) {
    const schoolId = option.schoolId;
    this.setData({schoolId});
  },

  onShow() {
    fetchSchools().then(res => {
      this.setData({
        schools: res.schools,
        current: res.schoolList.filter(item => item.id == this.data.schoolId)[0],
      })
    })
  },

  switchSchool(e) {
    const schoolId = e.currentTarget.dataset.schoolid;
    wx.setStorageSync('my_school', schoolId);
    wx.setStorageSync('needRefresh', true);
    wx.navigateBack();
  },

});
