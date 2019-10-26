// pages/my/order_manage/order_details/detailed_pictures/detailed_pictures.js
Page({

    data: {
        imgArr: [],
        imgSrc: ""
    },

    switchPicture(e) {
        if (e.currentTarget.dataset.type == "previous") {
            this.setData({ imgSrc: this.data.imgArr[0].url });
        } else {
            this.data.imgArr[1] && this.setData({ imgSrc: this.data.imgArr[1].url });
        }
    },


    onLoad(options) {
        wx.apiRequest("/api/user/orderDetail", {
            method: "post",
            data: { token: wx.getStorageSync("token"), orderid: options.orderid },
            success: res => res.data.code == 200 && this.setData({ imgArr: res.data.data.imgs, imgSrc: res.data.data.imgs[0].url })
        })
    },

})