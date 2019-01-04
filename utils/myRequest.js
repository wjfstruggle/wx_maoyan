// 请求参数，请求方式等。。

function myRequest(options) {
    if (!options.url) {
        return false
    }
    wx.request({
        url: options.url,       // 地址
        data: options.data || {}, // 数据
        method: options.method || 'GET', // 请求方式
        success: options.success, // 成功回调
        fail: options.fail          // 失败回调
    })
}
module.exports = {
    myRequest: myRequest
}
// myRequest({
//     url: '',
//     data: '',

// })