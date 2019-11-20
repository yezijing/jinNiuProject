<template>
  <div id="login" :style="backgroundDiv">
    <div class="loginBox">
      <div class="loginCon">
        <p class="title">金牛区重点项目</p>
        <p class="title">目标督查在线管理平台</p>
        <el-card shadow="always" class="login-module" v-if="smdl">
          <div slot="header" class="clearfix formTitlt">
            <span>用户登录</span>
          </div>
          <el-form :model="loginForm" status-icon label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入登录账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="loginForm.password" auto-complete="off"
                        placeholder="请输入登录密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="subBtn" type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      smdl: true,
      backgroundDiv: {
            backgroundImage: 'url('+require('../../assets/bg.jpg')+')'
       },
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    submitForm () {
      let that = this
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        this.$message({
          showClose: true,
          message: '账号或密码不能为空',
          type: 'error'
        })
        return false
      } else {
        // 将 username 设置为 token 存储在 store，仅为测试效果，实际存储 token 以后台返回为准
        that.$store.dispatch('setToken', that.loginForm.username).then(() => {
          that.$router.push({path: '/'})
        }).catch(res => {
          that.$message({
            showClose: true,
            message: res,
            type: 'error'
          })
        })
      }
    },
    message() {
      const h = this.$createElement;
      this.$notify({
        title: '账号密码',
        message: h('i', { style: 'color: teal'}, '账号密码可以随意填写'),
        duration: 6000
      });
    },
  },
  mounted() {
    this.message()
  }
}
</script>
<style lang="scss">
  #login {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    .loginBox {
      padding: 150px 0 0;
      .iconcolor {
        color: #409EFF;
      }
      .loginCon {
        width: 990px;
        margin: auto;
        position: relative;
        height: 388px;

        .el-card__header {
          border-bottom: 0px;
        }
        .title{
          font-size: 36px;
          font-weight: 600;
          color: #ffffff;
          width: 500px;
          float: left;
          margin-top: 0px;
          &:first-child{
            font-size: 34px;
            margin-top: 50px;
            margin-bottom: 30px;
          }
        }
        .login-module {
          width: 380px;
          height: 325px;
          margin-top: 60px;
          border: none;
          position: absolute;
          right: 0;

          .formTitlt {
            font-size: 18px;
            font-weight: 400;

            .titIconbox {
              float: right;

              .pointer {
                cursor: pointer;
              }
            }
          }

          .smalltxt {
            text-align: right;

            .a {
              text-decoration: none;
              color: #999999;
              font-size: 12px;
              margin-left: 8px;
            }
          }
        }

        .el-form-item__content {
          margin-left: 0px !important;

          .subBtn {
            width: 100%;
          }
        }
      }

      .el-input__inner, .el-button, .el-card, .el-message {
        border-radius: 0px !important;
      }

      .el-form-item__content .ico {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999;
        width: 40px;
        height: 39px;
        text-align: center;
        border-right: 1px solid #ccc;
      }

      .ewmbox {
        width: 100%;
        height: 240px;
        margin-top: -25px;

        .ewm {
          width: 140px;
          height: 140px;
          margin: 20px auto;

          p {
            font-size: 12px;
            padding-left: 40px;
            margin: 0;
          }
        }

        .ewmicon {
          width: 140px;
          margin: 20px auto 0;

          .iconfont {
            float: left;
          }

          p {
            font-size: 12px;
            padding-left: 40px;
            margin: 0;
          }
        }
      }
    }
  }
</style>
