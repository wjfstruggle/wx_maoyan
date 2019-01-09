// pages/tabBar/movie/movie.js
const api = require('../../../utils/api') // 引入API
const { myRequest } = require('../../../utils/myRequest') // 引入请求函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [], // 电影首页数据
    movieIds: [], // 电影id
    switchItem: 0,
    mostExpectedList: [], // 最近受期待
    offset: 0,  // 请求数量
    loadScrollLow: false, // //水平滚动加载的数据是否加载完毕
    comingList: [],// 电影列表
    moreComingList: [],// 更多电影列表
    moreMovieIds: [] // 更多电影列表id
  },
  //切换热映和即将上映
  selectItem(e) {
    let item = e.target.dataset.item;
    const { offset } = this.data
    this.setData({
      switchItem: item
    })
    if (item === 1 && !this.data.mostExpectedList.length) {
      wx.showLoading({
        title: '正在加载',
        duration: 2000
      });
      this.mostExpected(offset);
      // 更多电影
      myRequest({
        url: api.comingList,
        data: {
          ci: 20,
          token: '',
          limit: 10
        },
        success: res => {
          let comingList = this.picFix(res.data.coming,'128.180');
          let moreMovieIds = res.data.movieIds;
          this.setData({
            comingList: comingList,
            moreMovieIds: moreMovieIds
          })
        }
      })
    }
  },
  mostExpected(offset) {
    // 请求数据
    myRequest({
      url: api.mostExpected,
      data: {
        ci: 20, // 广州
        limit: 10, // 一次请求限制10条
        offset: offset,
        token: ''
      },
      success: res => {
        let mostExpectedList = this.picFix(res.data.coming,'170.230')
        this.setData({
          mostExpectedList: mostExpectedList
        })
      }
    })
  },
  // 滚动到底部/右边，会触发 scrolltolower 事件
  lower(e) {
    const { mostExpectedList, loadScrollLow } = this.data
    const len = mostExpectedList.length;
    if (loadScrollLow) {
      return;
    }
    myRequest({
      url: api.mostExpected,
      data: {
        ci: 20, // 广州
        limit: 10, // 一次请求限制10条
        offset: len,
        token: ''
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          mostExpectedList: mostExpectedList.concat(this.picFix(res.data.coming,'170.230')),
          loadScrollLow: !res.data.paging.hasMore || !res.data.coming.length // 判断是否全部加载完毕
        })
      }
    })
  },
  // 电影首页第一次请求
  movieListInfo() {
     myRequest({
        url: api.movieList, // api接口
        data: {
          token: '', // 参数
        },
        success: res => {
          let movieList = this.picFix(res.data.movieList, '128.180'); // 电影列表
          let movieIds = res.data.movieIds; // 电影id
          this.setData({
            movieList: movieList,
            movieIds: movieIds
          })
        }
      })
  },
 
  onLoad: function (options) {
    this.movieListInfo();
  },
  // 处理图片函数
  picFix(list, wh) {
    let newArr = []
    if (!list.length) {
      return false
    } else {
      list.forEach(item => {
        let imgUrl = item.img.replace('w.h', wh);
        newArr.push({
          ...item, // 解构
          img: imgUrl,
        })
      })
    }
    return newArr;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中',
      duration: 1000
    });
    myRequest({
      url: api.movieList, // spi接口
      data: {
        token: '', // 参数
      },
      success: res => {
        wx.stopPullDownRefresh()
        // wx.hideLoading();
        let movieList = this.picFix(res.data.movieList, '128.180'); // 电影列表
        let movieIds = res.data.movieIds; // 电影id
        this.setData({
          movieList: movieList,
          movieIds: movieIds
        })
      }
    })
  },
  // 下拉刷新函数
  moreComingListTop() {
    this.movieListInfo();
  },
  // 到底加载函数
  moreComingList(list, movieIds) {
    let arrIndex = 12;
    let limit = 12;
    let tosee = movieIds.splice(arrIndex, limit) // 一次加载12条
    tosee = tosee.join(',')
    // console.log(tosee);

    wx.request({
      url: api.moreComingList,
      data: {
        movieIds: tosee,
        token: '', // 参数
      },
      success: (result) => {
        wx.showLoading({
          title: '加载中',
          duration: 1000
        });
        // 加载的内容拼接
        if (result.data.coming.length !== 0) {
          this.setData({
            movieList: list.concat(this.picFix(result.data.coming, '128.180'))
          })
        } else {
          wx.showToast({
            title: '已无更多内容',
            icon: 'none',
            duration: 1500
          });
          return;
        }       
      }
    });
  },
  moreComingList_up(list, movieIds) {
    let arrIndex = 10;
    let limit = 10;
    let tosee = movieIds.splice(arrIndex, limit) // 一次加载10条
    tosee = tosee.join(',')
    wx.request({
      url: api.moreComingList_up,
      data: {
        movieIds: tosee,
        ci: 20,
        token: '',
        limit: 10
      },
      success: (result) => {
        wx.showLoading({
          title: '加载中',
          duration: 1000
        });
        // 加载的内容拼接
        if (result.data.coming.length !== 0) {
          this.setData({
            comingList: list.concat(this.picFix(result.data.coming, '128.180'))
          })
        } else {
          wx.showToast({
            title: '已无更多内容',
            icon: 'none',
            duration: 1500
          });
          return;
        }       
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {
      movieList,
      movieIds,
      moreMovieIds,
      comingList
    } = this.data;
    this.moreComingList(movieList, movieIds)// 正在热映电影列表
    this.moreComingList_up(comingList,moreMovieIds)// 即将上映电影列表
  },
  onShareAppMessage: function () {

  }
})