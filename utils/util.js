const requestUrl = "https://ys.shdong.cn";

wx.apiRequest = (url, params) => wx.request({ url: requestUrl + url, ...params });
