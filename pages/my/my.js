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
        isLogin: false,
        personal_data: {}
    },

    getUserInfo(res) {
        if (res.detail.userInfo) {
            wx.getUserInfo({
                success: res => {
                    wx.apiRequest("/api/user/upinfo", {
                        method: "post",
                        data: {
                            nickname: res.userInfo.nickName,
                            avatar: res.userInfo.avatarUrl,
                            sex: res.userInfo.gender,
                            token: wx.getStorageSync("token")
                        },
                        success: res => wx.redirectTo({ url: "my" })
                    });
                }
            });
        } else {
            wx.showToast({
                title: "您拒绝了微信授权！",
                icon: 'none',
                duration: 1200
            });
        }
    },

    goto(e) {
        if (!this.data.personal_data.nickname) {
            this.setData({ isLogin: true })
        } else {
            console.log(e)
            wx.navigateTo({ url: e.currentTarget.dataset.url })
        }
    },

    login() {
        if (!this.data.personal_data.nickname) {
            this.setData({ isLogin: true })
        }
        return false;
    },

    cancle() {
        this.setData({ isLogin: false })
    },

    onShow() {
        wx.apiRequest("/api/user/getinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => res.data.code == 200 && this.setData({ personal_data: res.data.data })
        });
    }
})