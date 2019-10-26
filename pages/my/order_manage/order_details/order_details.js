// pages/my/order_manage/order_details/order_details.js
Page({


    data: {
        order_details: {}
    },


    onLoad(options) {
        this.setData({ orderid: options.orderid });

        wx.apiRequest("/api/user/orderDetail", {
            method: "post",
            data: { token: wx.getStorageSync("token"), orderid: options.orderid },
            success: res => res.data.code == 200 && this.setData({ order_details: res.data.data })
        })
    },

})