// pages/orderInfo.js

import QQMapWX from "../../utils/qqmap-wx-jssdk";
const app = getApp();
const now = new Date();
let qqmapsdk;

Page({

    data: {
        option: [],
        userInfo: {},
        title: "找氛围布置商家",
        statusBarHeight: app.globalData.statusBarHeight,
        titleHeight: app.globalData.menuButton.height + (app.globalData.menuButton.top - app.globalData.statusBarHeight) * 2,
        hasOther: false,
        showMenu: false,
        date: now.toLocaleString().replace(/\//g, '-').split(" ")[0].replace(",", ""),
        time: `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`,
        area: "选择地区",
        curAddress: [],
        selectedOption: [],
        paymethod: "马上支付(微信)",
        menu: "线下付款",
        showOption: true,
        showModal: true,
        inputRemarkCount: 0,
        inputNeedDescriptionCount: 0,
        money: '0.00',
        inputName: '',
        inputNumber: '',
        inputAddress: '',
        inputKeyword: '',
        inputNeedDescription: '',
        inputRemark: '',
        inputMinpay: '',
        inputReward: '',
        uploadImagePath: []
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

    savaValue(e) {
        this.setData({ [e.currentTarget.dataset.type]: e.detail.value })
        if (e.currentTarget.dataset.type == "inputMinpay") {
            this.setData({ money: (this.data.inputMinpay * this.data.discount).toFixed(2) })
        }
        if (e.currentTarget.dataset.type == "inputRemark" || e.currentTarget.dataset.type == "inputNeedDescription") {
            this.setData({ [e.currentTarget.dataset.type + 'Count']: e.detail.value.length })
        }
    },

    showModal() {
        this.setData({ showModal: false })
    },

    modalSubmit(e) {
        if (e.type == "confirm") {
            this.setData({ userInfo: { username: this.data.inputName, phone: this.data.inputNumber, weixin: this.data.inputWechat } })
        }
        this.setData({ showModal: true })
    },

    goto(e) {
        if (e.currentTarget.dataset.type == "previous") {
            if (this.data.showOption) {
                wx.navigateBack();
            } else {
                this.setData({ showOption: true });
            }
        } else {
            if (!this.data.showOption) {

                let imgsId = [];
                this.data.uploadImagePath.map(item => {
                    imgsId.push(item.id)
                });

                if (!!this.data.selectedOption.length && (this.data.area && this.data.area != "选择地区") && this.data.inputAddress && this.data.inputMinpay && this.data.inputMaxpay && (this.data.inputName || this.data.userInfo.username) && (this.data.inputNumber || this.data.userInfo.phone)) {

                    if (this.data.inputMinpay <= this.data.inputMaxpay) {
                        wx.apiRequest("/api/need/order", {
                            method: "post",
                            data: {
                                token: wx.getStorageSync("token"),
                                username: this.data.inputName || this.data.userInfo.username,
                                phone: this.data.inputNumber || this.data.userInfo.phone,
                                weixin: this.data.inputWechat,
                                address: this.data.area + "-" + this.data.inputAddress,
                                startime: this.data.date + "-" + this.data.time,
                                need: this.data.selectedOption.toString() + this.data.inputKeyword,
                                needType: this.data.title == "找专业人士" ? 1 : 2,
                                description: this.data.inputNeedDescription,
                                remark: this.data.inputRemark,
                                minpay: this.data.inputMinpay,
                                maxpay: this.data.inputMaxpay,
                                tip: this.data.inputReward,
                                pay: this.data.inputMinpay * this.data.discount,
                                paymethod: this.data.paymethod == "线下付款" ? 2 : 1,
                                imgs: this.data.title == "找专业人士" ? null : imgsId.toString()
                            },
                            success: res => {
                                if (res.data.code == 200) {
                                    if (res.data.data.paymethod == 1) {
                                        wx.requestPayment({
                                            'timeStamp': res.data.data.timeStamp.toString(),
                                            'nonceStr': res.data.data.nonceStr,
                                            'package': res.data.data.package,
                                            'signType': 'MD5',
                                            'paySign': res.data.data.paySign,
                                            'success'(res) {
                                                wx.apiRequest("/api/need/selectOrder", {
                                                    method: "post",
                                                    data: { token: wx.getStorageSync("token"), orderid: res.data.data.orderid },
                                                    complete: res => {
                                                        if (res.data.code == 200) {
                                                            wx.showToast({
                                                                title: this.data.title == "找专业人士" ? "支付成功！" : "付款成功! 请稍等正在为您匹配对应位置的商家",
                                                                icon: 'success',
                                                                duration: 5000,
                                                                success: res => setTimeout(() => { wx.redirectTo({ url: '../my/order_manage/order_manage?isPay=0' }) }, 5000)
                                                            });
                                                        } else {
                                                            wx.showToast({ title: "下单失败！", icon: "none", duration: 1200 })
                                                        }
                                                    }
                                                });
                                            },
                                            'fail'(res) {
                                                wx.showToast({ title: "下单失败！", icon: "none", duration: 1200 })
                                            }
                                        })
                                    } else {
                                        wx.showToast({
                                            title: "下单成功！",
                                            icon: 'success',
                                            duration: 1200
                                        });
                                        setTimeout(() => { wx.redirectTo({ url: '../my/order_manage/order_manage?isPay=1' }) }, 1200)
                                    }
                                } else {
                                    wx.showToast({
                                        title: res.data.msg,
                                        icon: 'none',
                                        duration: 1200
                                    });
                                }

                            }
                        })
                    } else {
                        wx.showToast({
                            title: "价格预算最大值不能小于最小值！",
                            icon: 'none',
                            duration: 1200
                        });
                    }

                } else {
                    wx.showToast({
                        title: "你的信息不完整！",
                        icon: 'none',
                        duration: 1200
                    });
                }

            } else {
                this.setData({ showOption: false })
            }
        }
    },

    selected() {
        this.setData({ paymethod: this.data.menu, menu: this.data.paymethod });
        this.hideMenu();
    },

    hideMenu() {
        this.setData({ showMenu: false })
    },

    showMenu() {
        this.setData({ showMenu: !this.data.showMenu })
    },

    choose(e) {
        this.setData({ selectedOption: e.detail.value, hasOther: e.detail.value.includes("其他") ? true : false });
    },

    onShow() {
        if (this.data.statusBarHeight) {
            wx.getSystemInfo({
                success: res => {
                    this.setData({ statusBarHeight: res.statusBarHeight })
                }
            })
        }


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



    },

    onLoad(options) {

        qqmapsdk = new QQMapWX({
            key: 'LPQBZ-NIGL4-CSVUT-DET57-GPCQ2-SWFK3'
        });

        this.setData({ title: options.title });
        wx.apiRequest("/api/need/config", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        option: options.title == "专业人士" ? res.data.data.worker : res.data.data.business,
                        discount: options.title == "专业人士" ? res.data.data.disWorker : res.data.data.disBusiness
                    })
                } else {
                    console.log(res.data.msg);
                }
            }
        });
        wx.apiRequest("/api/user/getinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => {
                res.data.code && this.setData({ userInfo: res.data.data })
            }
        });
    }
})
