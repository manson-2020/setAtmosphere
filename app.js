//app.js

import "./utils/util";

App({

    onShow() {
        wx.getSystemInfo({
            success: res => {
                this.globalData.statusBarHeight = res.statusBarHeight;
            }
        })

        // 登录
        wx.login({
            success: res => {
                wx.apiRequest("/api/login/index", {
                    method: "post",
                    data: { code: res.code },
                    success: res => {
                        res.data.code == 200 && wx.setStorageSync("token", res.data.data)
                    }
                })
            },
        });
    },


    globalData: {
        statusBarHeight: 0,
        menuButton: wx.getMenuButtonBoundingClientRect()
    }
})