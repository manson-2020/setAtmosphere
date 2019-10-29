//index.js
const app = getApp();

Page({

    data: {
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

    onShow() {
        if (!this.data.statusBarHeight) {
            wx.getSystemInfo({
                success: res => {
                    this.setData({ statusBarHeight: res.statusBarHeight })
                }
            })
        }
        wx.apiRequest("/api/user/getinfo", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => res.data.code == 200 && this.setData({ userInfo: res.data.data })
        });
    },

    onLoad() {
        wx.apiRequest("/api/home/banner", {
            method: "post",
            data: { token: wx.getStorageSync("token") },
            success: res => {
                res.data.code == 200 && this.setData({ images: res.data.data.slice(0, 3) })
            }
        });
    }
})
