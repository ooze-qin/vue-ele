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
              <el-button type="success" class="block" @click="getCode"
                >获取验证码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item class="form-item">
          <el-button
            type="danger"
            class="block top"
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
import { get_code } from "@/api/login.js";
export default {
  setup(prop, { refs, root }) {
    // --------------------------------生命周期-------------------------

    // --------------------------------data-------------------------
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
        callback(new Error("请输入邮箱"));
      } else if (vaildateUtils.test_email(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
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
        callback(new Error("请输入密码"));
      } else if (vaildateUtils.test_password(value)) {
        callback(new Error("密码格式6~20位"));
      } else {
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
      console.log("验证重复密码");

      // 过滤非法字符
      ruleForm.password1 = value = vaildateUtils.validate_inputValue(
        value,
        "password1"
      );

      if (value !== ruleForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
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
    // ------------------------------methods-------------------------
    const submitForm = formName => {
      // 对表单的每一个字段进行验证
      refs[formName].validate(result => {
        if (result) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          console.log(result);
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
    };

    // 获取验证码
    const getCode = () => {
      // 判断如果邮箱不存在
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空");
        return false;
      }

      const data = {
        username: ruleForm.username,
        module: mode.value
      };
      get_code(data)
        .then(res => {
          root.$message.success(res.data.message);
        })
        .catch(err => {
          // console.log("请求错误",err)
          console.log(2);
        });
    };

    return {
      mode,
      meauTab,
      ruleForm,
      rules,
      toggleMeau,
      submitForm,
      getCode
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
