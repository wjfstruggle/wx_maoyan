// pages/subPages/movieDetail/movieDetail.js
const api = require('../../../utils/api') // 引入API
const {
  myRequest
} = require('../../../utils/myRequest') // 引入请求函数
const util = require('../../../utils/util.js')
Page({
  data: {
    movieId: '', // 电影id
    detailMovie: {}, // 电影详情
    day: '',  // 年月日
    cinemaList: [], // 影院信息
    showDays: [],  // 时间
    isFlod: false   // 折叠
  },
  onLoad: function (options) {
    let day = util.dayTime()
    this.setData({
      day: day
    })
    // 接收参数
    let movieId = options.movieIds;
    this.initPage(movieId)
    // 时间和影院信息
    myRequest({
      url: api.movie,
      data: {
        movieId: movieId,
        day: day,
        offset: 0,
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
        reqId: 1547102792816,
        cityId: 20
      },
      method: "POST",
      success: res => {
        let showDays = res.data.showDays.dates;
        let cinemaList = res.data.cinemas;
        this.setData({
          showDays: showDays,
          cinemaList: cinemaList
        })
      }
    })
  },
  // 初始页面
  initPage(movieId) {
    wx.showLoading({
      title: '加载中...',
      duration: 1500
    })
    myRequest({
      url: api.detailMovie,
      data: {
        movieId: movieId
      },
      success: res => {
        wx.hideLoading();
        let detailMovie = this.dataProcess(res.data.detailMovie);
        this.setData({
          detailMovie: detailMovie,
          movieId: movieId
        })
      }
    })
  },
  // 数据处理函数
  dataProcess(data) {
    let obj = data;
    // 图片处理
    obj.img = obj.img.replace('w.h', '220.300');
    // 保留一位小数
    obj.snum = Number(obj.snum / 10000).toFixed(1)
    //评分星星,满分10分，一颗满星代表2分
    obj.stars = this.formatStar(obj.sc/2)
    // 媒体库图片
    obj.photos = obj.photos.map( item => {
      return item.replace('w.h', '250.140')
    })
    return obj;
  },
  // 处理星星评分
  formatStar(sc) {
    // 1分对应满星，0.5对应半星
    let stars = new Array(5).fill('star-empty'); // 填充
    const fullStars = Math.floor(sc); // 满星
    const halfStars = sc % 1 ? 'star-half' : 'star-empty' // 半星个数最多一个
    stars.fill('star-full', 0, fullStars) // 填充满星
    if (fullStars < 5) {
      stars[fullStars] = halfStars; // 填充半星
    }
    return stars
  },
  // 折叠函数
  toggleFold() {
    this.setData({
      isFlod: !this.data.isFlod
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})