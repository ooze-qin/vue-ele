/* eslint-disable prettier/prettier */
<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="meau-tab">
        <li
          :class="{ current: item.current }"
          v-for="(item, index) in meauTab"
          :key="index"
          @click="toggleMeau(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="form-item">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form-item">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          v-show="mode == 'register'"
          prop="password1"
          class="form-item"
        >
          <label for="password1">重复密码</label>
          <el-input
            id="password1"
            type="text"
            v-model="ruleForm.password1"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="form-item">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input id="code" v-model="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                v-bind:disabled="codeButtonStates"
                class="block"
                @click="getCode"
                >{{ codeButtonText }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item class="form-item">
          <el-button
            type="danger"
            class="block top"
            :disabled="buttonStatus"
            @click="submitForm('ruleForm')"
            >{{ this.mode == "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import vaildateUtils from "@/utils/validate.js";
import { onMounted, reactive, ref } from "@vue/composition-api";
import { get_code, do_register, do_login } from "@/api/login.js";
export default {
  setup(prop, { refs, root }) {
    // --------------------------------生命周期-------------------------

    // --------------------------------data-------------------------
    const status_username = ref(false);
    const status_password = ref(false);
    const status_password1 = ref(false);

    // 验证验证码
    let validateCode = (rule, value, callback) => {
      // 过滤非法字符
      ruleForm.code = value = vaildateUtils.validate_inputValue(value, "code");

      if (!value) {
        return callback(new Error("验证码不能为空"));
      } else if (vaildateUtils.test_code(value)) {
        callback(new Error("验证码格式错误"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    let validateUsername = (rule, value, callback) => {
      // 过滤非法字符
      ruleForm.username = value = vaildateUtils.validate_inputValue(
        value,
        "email"
      );

      if (value === "") {
        status_username.value = false;
        callback(new Error("请输入邮箱"));
      } else if (vaildateUtils.test_email(value)) {
        status_username.value = false;
        callback(new Error("邮箱格式错误"));
      } else {
        status_username.value = true;
        callback();
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 验证的字段 输入的值 验证后做什么(回调函数)

      // 过滤非法字符
      ruleForm.password = value = vaildateUtils.validate_inputValue(
        value,
        "password"
      );

      if (value === "") {
        status_password.value = false;
        callback(new Error("请输入密码"));
      } else if (vaildateUtils.test_password(value)) {
        status_password.value = false;
        callback(new Error("密码格式6~20位"));
      } else {
        status_password.value = true;
        callback();
      }
    };
    // 验证重复密码
    let validatePassword1 = (rule, value, callback) => {
      // 验证的字段 输入的值 验证后做什么(回调函数)
      if (mode.value == "login") {
        callback();
        return;
      }
      // console.log("验证重复密码");

      // 过滤非法字符
      ruleForm.password1 = value = vaildateUtils.validate_inputValue(
        value,
        "password1"
      );

      if (value !== ruleForm.password) {
        status_password1.value = false;
        callback(new Error("两次密码不一致"));
      } else {
        status_password1.value = true;
        callback();
      }
    };

    // 定义tab切换模式
    const mode = ref("login");
    // 定义表单相关数据
    const meauTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // input绑定的数据
    const ruleForm = reactive({
      username: "",
      password: "",
      password1: "",
      code: ""
    });
    // 校验方式
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      password1: [{ validator: validatePassword1, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    // 定义登录按钮禁用和启用
    const buttonStatus = ref(true);
    //定义验证码按钮的启用和禁用
    const codeButtonStates = ref(false);
    // 定义验证码按钮文本
    const codeButtonText = ref("获取验证码");
    // 定义验证码延迟定时器
    const timer_delay = ref(null);
    // 定义验证码倒计时定时器
    const timer_count_down = ref(null);

    // ------------------------------methods-------------------------
    const submitForm = formName => {
      // 对表单的每一个字段进行验证
      refs[formName].validate(result => {
        if (result) {
          // 执行登录注册
          mode.value === "login" ? doLogin() : doRegister();
          // alert("submit!");
        } else {
          // console.log("error submit!!");
          // console.log(result);
          return false;
        }
      });
    };

    const toggleMeau = item => {
      meauTab.map(item => (item.current = false));
      item.current = true;
      mode.value = item.type;
      // 点击切换的时候清空表单数据
      refs["ruleForm"].resetFields();
      // 还原验证码的相关状态
      resetCodeButton();
      // 还原登录注册按钮转态
      buttonStatus.value = true;
    };

    // 获取验证码
    const getCode = () => {
      const { result, filed } = validateFileds();
      let offset = 0;
      // 判断邮箱格式 密码 重复密码 的格式
      if (!result) {
        //true 验证通过 false 验证失败
        filed.map(item => {
          offset += 40;
          root.$message({
            type: "error",
            message: `错误字段:${item.message}`,
            offset: offset,
            duration: 2000
          });
          // root.$message.error(`错误字段:${item.filed}`);
        });
        return false;
      }
      //让按钮禁用 显示'发送中'
      setCodeButton({
        status: true,
        text: "发送中"
      });

      //为了模拟网络延迟 定时器
      timer_delay.value = setTimeout(() => {
        const data = {
          username: ruleForm.username,
          module: mode.value
        };
        get_code(data)
          .then(res => {
            // 显示倒计时
            countDown(10);
            //获取到对应的验证码
            root.$message.success(res.data.message);

            // 登录注册按钮启用
            buttonStatus.value = false;
          })
          .catch(err => {
            // console.log("请求错误",err)
            console.log(2);
          });
      }, 3000);
    };

    // -----------------------------------辅助方法------------------------
    // 验证码定时器的倒计时效果
    const countDown = timer => {
      if (timer_count_down.value) {
        //存在定时器
        clearTimeout(timer_count_down.value);
      }
      timer_count_down.value = setInterval(() => {
        timer--;
        if (timer === 0) {
          clearInterval(timer_count_down.value);
          // 显示重新发送
          setCodeButton({
            status: false,
            text: "重新发送"
          });
        } else {
          codeButtonText.value = `倒计时${timer}秒`;
        }
      }, 1000);
    };

    // 还原验证码的相关状态
    const resetCodeButton = () => {
      // 默认 启用 获取验证码
      setCodeButton({
        status: false,
        text: "获取验证码"
      });
      // 清空所有定时器
      clearTimeout(timer_delay.value);
      clearInterval(timer_count_down.value);
    };

    // 设置获取验证码的相关状态
    const setCodeButton = ({ status, text }) => {
      codeButtonStates.value = status;
      codeButtonText.value = text;
    };

    // 执行登录
    const doLogin = () => {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code
      };
      do_login(data)
        .then(res => {
          root.$message.success(res.data.message);
        })
        .catch(err => {});
    };

    // 执行注册
    const doRegister = () => {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code
      };
      do_register(data)
        .then(res => {
          // 提示注册成功
          root.$message.success(res.data.message);
          // 注册成功后直接切换到登录tab
          toggleMeau(meauTab[0]);
        })
        .catch(err => {});
    };

    // 获取验证码时候验证相关字段
    const validateFileds = () => {
      //let _filed = staatus_username.value ? '' : '邮箱格式错误';
      const _filed_arr = [
        {
          filed: "username",
          flag: status_username.value,
          message: "邮箱格式错误"
        },
        {
          filed: "password",
          flag: status_password.value,
          message: "密码格式错误"
        },
        {
          filed: "password1",
          flag: status_password1.value,
          message: "重复密码错误"
        }
      ].filter(item => !item.flag);
      console.log(_filed_arr);
      return {
        result:
          status_username.value &&
          status_password.value &&
          status_password1.value,
        filed: _filed_arr
      };
    };

    return {
      mode,
      meauTab,
      ruleForm,
      rules,
      toggleMeau,
      submitForm,
      getCode,
      buttonStatus,
      codeButtonStates,
      codeButtonText
    };
  }
};
</script>

<style lang="scss">
#login {
  height: 100vh; //vh:基于浏览器的可视区域处理的
  background-color: #344a5f;
}
.login-wrap {
  padding-top: 250px;
  width: 330px;
  margin: 0 auto;
}
.meau-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 3px;
    color: #fff;
  }
  .form-item {
    margin-bottom: 13px;
  }
  .top {
    margin-top: 25px;
  }
  .block {
    display: block;
    width: 100%;
  }
}
</style>
