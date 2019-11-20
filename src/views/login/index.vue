<template>
  <div id="login" :style="backgroundDiv">
    <div class="loginBox">
      <div class="loginCon">
        <p class="title">{{loginName}}</p>
        <!-- <p class="title">智慧办公平台</p> -->
        <el-card shadow="always" class="login-module" v-if="smdl">
          <div slot="header" class="clearfix formTitlt">
            <span>用户登录</span>
          </div>
          <el-form :model="loginForm" status-icon label-width="100px" class="demo-ruleForm">
            <el-form-item>
              <el-input
                type="text"
                v-model="loginForm.logname"
                auto-complete="off"
                placeholder="请输入登录账号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="请输入登录密码"
                @keyup.enter.native="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="subBtn" type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>

    <!-- 修改密码 -->
    <el-dialog title="首次登录需要修改密码" :visible.sync="addFormVisible" width="600px">
      <el-form :model="addForm" :rules="addFormRules" label-width="150px" ref="addForm">
        <el-form-item label="新密码：" prop="newpwd">
          <el-input type="password" v-model="addForm.newpwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="renewpwd">
          <el-input type="password" v-model="addForm.renewpwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { login, changePwd, systemDetail } from "../../api/api";
import { upfile, imgIp } from "../../api/imgUrl";
import md5 from "md5";
export default {
  data() {
    return {
      smdl: true,
      upfile: "",
      imgIp: "",
      addFormVisible: false,
      backgroundDiv: {
        backgroundImage: "url(" + require("../../assets/bg.jpg") + ")"
      },
      addForm: {},
      addFormRules: {
        newpwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "change"
          }
        ],
        renewpwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value !== this.addForm.newpwd) {
                  callback("两次输入密码不一致");
                } else {
                  callback();
                }
              } else {
                callback("请输入新密码");
              }
            }
          }
        ]
      },
      loginForm: {
        logname: "",
        password: ""
      },
      bgUrl: "",
      setname: "",
      logoUrl: "",
      setinfo: {},
      loginName: "智慧办公平台",
      unitname:""
    };
  },
  created() {
    this.systemList();
  },
  methods: {
    systemList() {
      systemDetail("", data => {
        this.upfile = upfile;
        this.imgIp = imgIp;
        this.bgUrl = this.imgIp + data.data.obj.backgroundname;
        this.logoUrl = this.imgIp + data.data.obj.logoname;
        this.loginName = data.data.obj.systemname;
        this.setname = data.data.obj.systemname;
        this.unitname = data.data.obj.unitname;
        this.backgroundDiv = {
          backgroundImage: "url(" + this.bgUrl + ")"
        };
        this.setinfo.setname = this.setname;
        this.setinfo.logoUrl = this.logoUrl;
        this.setinfo.unitname = this.unitname;
        this.$store.dispatch("setSystemInfo", JSON.stringify(this.setinfo));
        document.getElementsByTagName("title")[0].innerHTML = this.loginName;
      });
    },
    submitForm() {
      let {
        loginForm: { logname, password }
      } = this;
      if (logname === "" || password === "") {
        this.$message({
          showClose: true,
          message: "账号或密码不能为空",
          type: "error"
        });
        return false;
      } else {
        login(
          { logname: logname, password: md5(password) },
          ({ data: { code, msg, obj } }) => {
            if (code === "0") {
              let { updatetime } = obj;
              this.$store.dispatch("setUserData", JSON.stringify(obj));
              
              if (updatetime) {
                this.$store.dispatch("setToken", logname).then(() => {
                  this.systemList();
                  this.$message({
                    message: "登录成功！",
                    type: "success"
                  });
                  setTimeout(() => {
                    this.$router.push({ path: "/" });
                  }, 1000);
                });
              } else {
                this.addFormVisible = true;
              }
            } else {
              this.$message({
                message: msg,
                type: "error"
              });
            }
          }
        );
      }
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let { createtime, ...userData } = JSON.parse(
            this.$store.getters.userdata
          );
          userData.password = md5(this.addForm.newpwd);
          changePwd(
            userData,
            res => {
              if (res.data.code === "0") {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.addFormVisible = false;
                this.$store.dispatch("setToken", logname).then(() => {
                  setTimeout(() => {
                    this.$router.push({ path: "/" });
                  }, 1000);
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
            },
            () => {
              this.$message({
                message: "修改失败",
                type: "error"
              });
            }
          );
        }
      });
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
#login {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  .loginBox {
    padding: 15% 0 0;
    .loginCon {
      max-width: 900px;
      margin: auto;
      position: relative;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 36px;
        font-weight: 600;
        color: #ffffff;
        margin-top: 0px;
        flex: 1;padding-right: 30px;
      }
      .login-module {
        width: 380px;
        height: 325px;
        border: none;
        .formTitlt {
          font-size: 18px;
          font-weight: 400;
        }
      }

      .el-form-item__content {
        margin-left: 0px !important;

        .subBtn {
          width: 100%;
        }
      }
    }

    .el-input__inner,
    .el-button,
    .el-card,
    .el-message {
      border-radius: 0px !important;
    }
  }
}
</style>
