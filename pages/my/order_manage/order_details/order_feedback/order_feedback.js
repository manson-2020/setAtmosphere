// pages/my/order_manage/order_details/order_feedback/order_feedback.js
Page({

    data: {
        order_details: [],
        text: "",
        uploadImagePath: []
    },

    submitFeedback() {
        let imgsId = '';
        this.data.uploadImagePath.map(item => {
            imgsId += item.id + ','
        });
        wx.apiRequest("/api/user/orderFeedback", {
            method: "post",
            data: {
                token: wx.getStorageSync("token"),
                orderid: this.data.orderid,
                text: this.data.text,
                imgs: imgsId.replace(/(^\,*)|(\,*$)/g, "")
            },
            success: res => {
                if (res.data.code == 200) {
                    this.setData({ order_details: res.data.data });
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 1200,
                        complete: () => {
                            setTimeout(wx.navigateBack, 1000);
                        }
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1200
                    });
                }
            }
        })
    },

    savaValue(e) {
        this.setData({ text: e.detail.value })
    },

    uploadPicture() {
        wx.chooseImage({
            count: 2 - this.data.uploadImagePath.length,
            sizeType: "compressed",
            success: res => {
                res.tempFilePaths.map(item => {
                    wx.uploadFile({
                        url: 'https://ys.shdong.cn/files/image/upload',
                        filePath: item,
                        name: 'image',
                        complete: res => {
                            let result = JSON.parse(res.data);
                            if (res.statusCode == 200) {
                                this.setData({ uploadImagePath: [...this.data.uploadImagePath, result.data] });
                                wx.showToast({
                                    title: result.msg,
                                    icon: 'success',
                                    duration: 1200
                                });
                            } else {
                                wx.showToast({
                                    title: result.msg,
                                    icon: 'none',
                                    duration: 1200
                                });
                            }
                        }
                    })
                })
            }
        })
    },


    onLoad(options) {
        this.setData({ orderid: options.orderid })
        wx.apiRequest("/api/user/orderDetail", {
            method: "post",
            data: {
                token: wx.getStorageSync("token"),
                orderid: options.orderid
            },
            success: res => { console.log(res.data); res.data.code == 200 && this.setData({ order_details: res.data.data }) }
        })
    },
})