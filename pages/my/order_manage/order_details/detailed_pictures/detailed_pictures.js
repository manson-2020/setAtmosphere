// pages/my/order_manage/order_details/detailed_pictures/detailed_pictures.js
Page({

    data: {
        imgArr: [],
        imgSrc: ""
    },

    switchPicture(e) {
        if (e.currentTarget.dataset.type == "next") {
            this.setData({ imgSrc: imgArr[0] });
        } else {
            this.setData({ imgSrc: imgArr[1] });
        }
    },


    onLoad(options) {
        wx.apiRequest("/api/user/orderDetail", {
            method: "post",
            data: { token: wx.getStorageSync("token"), orderid: options.orderid },
            success: res => { console.log(res.data.data.imgs[0].url); res.data.code == 200 && this.setData({ imgArr: res.data.data.imgs, imgSrc: res.data.data.imgs[0].url }) }
        })
    },

})