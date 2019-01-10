// pages/tabBar/cinema/cinema.js
const api = require('../../../utils/api') // 引入API
const { myRequest } = require('../../../utils/myRequest') // 引入请求函数
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cinemaList: [], // 影院信息
    offset: 0,       // 请求数量
    isHasMore: false,    // 下拉请求是否加载完成
    day: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let day = util.dayTime()
    this.setData({
      day: day
    })
    const { offset } = this.data;
    this.moreCinemaList(offset);
  },
  // 更多影院列表
  moreCinemaList(offset) {
    const {day} = this.data;
    myRequest({
      url: api.cinemaList, //影院接口
      data: {
        day: day,
        offset: offset,
        limit: 20,
        districtId: -1,
        lineId: -1,
        hallType: -1,
        brandId: -1,
        serviceId: -1,
        areaId: -1,
        stationId: -1,
        item: '',
        updateShowDay: true,
        reqId: 1547038419978,
        cityId: 20
      },
      success: res => {
        let cinemaList = res.data.cinemas;
        this.setData({
          cinemaList: cinemaList
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { isHasMore, cinemaList, day } = this.data;
    let len = cinemaList.length;
    // 判断是否加载完毕
    if (isHasMore) {
      return ;
    }
    wx.showLoading({
      title: '加载中',
      duration: 1000
    });
    myRequest({
      url: api.cinemaList, //影院接口
      data: {
        day: day,
        offset: len,
        limit: 20,
        districtId: -1,
        lineId: -1,
        hallType: -1,
        brandId: -1,
        serviceId: -1,
        areaId: -1,
        stationId: -1,
        item: '',
        updateShowDay: true,
        reqId: 1547038419978,
        cityId: 20
      },
      success: res => {
        this.setData({
          // 拼接数据
          cinemaList: cinemaList.concat(res.data.cinemas),
          isHasMore: !res.data.paging.hasMore || !res.data.cinemas.length // 判断是否全部加载完毕
        }) 
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})