// components/Header/Header.js
const app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ""
        },
        fontColor: {
            type: String,
            value: "#000"
        },
        backgroundColor: {
            type: String,
            value: "transparent"
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleHeight: app.globalData.menuButton.height + (app.globalData.menuButton.top - app.globalData.statusBarHeight) * 2,
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
