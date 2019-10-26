// pages/my/about_us/about_us.js
Page({


    data: {

    },

    onLoad(options) {
        wx.apiRequest("/api/user/about", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => res.data.code == 200 && this.setData({ about: res.data.data })
    });
    },


})