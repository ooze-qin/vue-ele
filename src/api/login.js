import axios from "@/utils/request.js";
// 请求响应和拦截

// 获取验证码
export const get_code = data => {
  return axios.request({
    method: "post",
    url: "/getSms/",
    data: data
  });
};
// 登录

// 注册
