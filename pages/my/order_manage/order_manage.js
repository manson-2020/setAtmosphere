// pages/my/order_manage/order_manage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: ["已", "未"],
        tabIndex: 0,
        orderArr: []
    },

    switchTab(e) {
        this.setData({ tabIndex: e.currentTarget.dataset.index });
        this.apiRequest(e.currentTarget.dataset.index);
    },

    apiRequest(status) {
        wx.apiRequest("/api/user/order", {
            method: "post",
            data: { token: wx.getStorageSync("token"), status },
            success: res => res.data.code && this.setData({ orderArr: res.data.data })
        })
    },
    onLoad(options) {
        this.apiRequest(this.data.tabIndex);
    }
})