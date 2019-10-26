// pages/my/my.js

const app = getApp();

Page({

    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleHeight: app.globalData.menuButton.height + (app.globalData.menuButton.top - app.globalData.statusBarHeight) * 2,
        options: [
            { title: "个人资料", name: "personal_data" },
            { title: "订单管理", name: "order_manage" },
            { title: "关于我们", name: "about_us" }
        ],
        personal_data: {}
    },

    onLoad(options) {
        wx.apiRequest("/api/user/getinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            complete: res => res.data.code == 200 && this.setData({ personal_data: res.data.data })
        })
    },

})