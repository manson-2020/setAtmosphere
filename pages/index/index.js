//index.js
const app = getApp();

Page({

    data: {
        isAuthorize: false,
        userInfo: {},
        statusBarHeight: app.globalData.statusBarHeight,
        menuButton: wx.getMenuButtonBoundingClientRect(),
        avatar: app.globalData.menuButton.height + (app.globalData.menuButton.top - app.globalData.statusBarHeight) * 2,
        active: 0,
        images: [],
        option: [
            { text: "找专业人士", class: "whiteBtn" },
            { text: "找氛围布置商家", class: "blueBtn white_color" }
        ]
    },

    swiperChange(e) {
        this.setData({ active: e.detail.current })
    },

    getUserInfo() {
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                wx.apiRequest("/api/login/upinfo", {
                    method: "post",
                    data: {
                        nickName: res.userInfo.nickName,
                        avatarUrl: res.userInfo.avatarUrl,
                        gender: res.userInfo.gender,
                        token: wx.getStorageSync("token")
                    },
                    success: req => { this.setData({ userInfo: req.data.data }) }
                });
            }
        });
    },
    onShow() {
        this.getUserInfo();
    },

    onLoad() {
        if (!app.globalData.statusBarHeight) {
            wx.getSystemInfo({
                success: res => {
                    this.setData({ statusBarHeight: res.statusBarHeight })
                }
            })
        }

        if (app.globalData.userInfo) {
            this.setData({ userInfo: app.globalData.userInfo });
        } else {
            wx.getSetting({
                success: res => {
                    this.setData({ isAuthorize: !res.authSetting["scope.userInfo"] })
                }
            });

            this.getUserInfo();
        }

        wx.apiRequest("/api/home/banner", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => {
                res.data.code == 200 && this.setData({ images: res.data.data.slice(0, 3) })
            }
        });
    },

    bindGetUserInfo(res) {
        if (res.detail.userInfo) {
            this.setData({ isAuthorize: false });
            wx.redirectTo({ url: "index" })
        } else {
            console.log("点击了拒绝授权");
        }
    }
})
