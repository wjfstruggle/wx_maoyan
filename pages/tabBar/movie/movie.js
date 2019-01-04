// pages/tabBar/movie/movie.js
const api = require('../../../utils/api') // 引入API
const { myRequest } = require('../../../utils/myRequest') // 引入请求函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [] // 电影首页数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    myRequest({
      url: api.movieList,
      data: {
        token: '',
      },
      success: res => {
		let movieList = this.picFix(res.data.movieList)
        this.setData({
			movieList: movieList
        })
      }
    })
  },
  // 处理图片函数
  picFix(list) {
	let newArr = []
	list.forEach(item => {
		let imgUrl = item.img.replace('w.h', '128.180');
		newArr.push({
			...item,	// 解构
			img: imgUrl
		})
	})
	return newArr;
  },
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