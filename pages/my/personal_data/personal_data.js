// pages/my/personal_data/personal_data.js

import QQMapWX from "../../../utils/qqmap-wx-jssdk";
let qqmapsdk;

Page({

    data: {
        personal_data: {},
        curAddress: [],
    },

    savaValue(e) {
        this.data.personal_data[e.currentTarget.dataset.type] = e.detail.value;
        this.setData({ personal_data: this.data.personal_data });
    },

    uploadPicture() {
        wx.chooseImage({
            count: 1,
            sizeType: "compressed",
            success: res => {
                wx.uploadFile({
                    url: 'https://ys.shdong.cn/files/image/upload',
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    complete: res => {
                        let result = JSON.parse(res.data);
                        if (res.statusCode == 200) {
                            console.log(result.data);
                            this.data.personal_data.avatar = result.data.url;
                            this.setData({ uploadImagePath: result.data, personal_data: this.data.personal_data });
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

            }
        })
    },


    savaSubmit(e) {
        let [address, area] = [this.data.personal_data.address, this.data.personal_data.area]
        this.data.personal_data.address = area.toString() != "选择地区" ? area.toString() + "-" + address : "";

        wx.apiRequest("/api/user/upinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token"), ...this.data.personal_data },
            success: res => {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: "修改成功",
                        icon: 'success',
                        duration: 1200,
                        success() {
                            setTimeout(wx.navigateBack, 1200);
                        }
                    });
                }
            }
        })
    },

    onLoad(options) {
        qqmapsdk = new QQMapWX({
            key: 'LPQBZ-NIGL4-CSVUT-DET57-GPCQ2-SWFK3'
        });

        wx.apiRequest("/api/user/getinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => {
                res.data.data.area = res.data.data.address.split("-")[0] || "选择地区";
                res.data.data.address = res.data.data.address.split("-")[1] || "";
                this.setData({ personal_data: res.data.data })
            }
        })
    },

    onShow() {
        wx.getLocation({
            altitude: false,
            success: res => {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: res => {
                        this.setData({ curAddress: [res.result.ad_info.province, res.result.ad_info.city, res.result.ad_info.district] })
                    },
                    fail(res) {
                        wx.showToast({
                            title: '解析地址错误',
                            icon: 'loading',
                            duration: 1000
                        });
                    },
                })
            }
        });
    }
})