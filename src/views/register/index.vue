<template>
    <!-- 注册页面的整体盒子 -->
    <div class="reg-container">
        <!-- 注册的盒子 -->
        <div class="reg-box">
            <!-- 标题的盒子 -->
            <div class="title-box"></div>
            <!-- 注册的表单区域 -->
            <el-form ref="regRef" :model="regform" :rules="rules">
                <el-form-item prop="username">
                    <el-input placeholder="请输入账号" type="text" v-model="regform.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" type="password" v-model="regform.password"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input placeholder="请再次输入密码" type="password" v-model="regform.repassword"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button class="btn-reg" type="primary" @click="onSubmit">登录</el-button>
                    <el-link type="info">去登录</el-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'my-register',

  data () {
    const samePwdFn = (rules, value, callback) => {
      if (value !== this.regform.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      regform: {
        username: '',
        password: '',
        repassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{6,10}$/,
            message: '用户名必须是6-10的大小写字母或数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          },
          { validator: samePwdFn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {

    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
    background: url('../../assets/images/login_bg.jpg') center;
    background-size: cover;
    height: 100%;

    .reg-box {
        width: 400px;
        height: 335px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0 30px;
        box-sizing: border-box;

        .title-box {
            height: 60px;
            background: url('../../assets/images/login_title.png') center no-repeat;
        }

        .btn-reg {
            width: 100%;
        }
    }
}
</style>
