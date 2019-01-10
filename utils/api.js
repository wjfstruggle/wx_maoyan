const baseUrl = 'http://m.maoyan.com/ajax/'

const api = {
    movieList: baseUrl + 'movieOnInfoList', // 电影首页接口
    moreComingList: baseUrl + 'moreComingList', // 电影首页加载更多信息
    mostExpected: baseUrl + 'mostExpected', // 最近受期待电影
    comingList: baseUrl + 'comingList', // 电影列表
    moreComingList_up: baseUrl + 'moreComingList', // 更多电影列表
    cinemaList: baseUrl + 'cinemaList', // 影院
    detailMovie: baseUrl + 'detailMovie',    // 电影详情页面
    movie: baseUrl + 'movie?forceUpdate=1547102795831'    // 时间和影院信息
}

module.exports = api;