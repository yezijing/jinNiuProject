<template>
  <div class="content-wrap changepsw">
    <p class="navtitle">
      <span>修改密码</span>
    </p>
    <div class="change">
      <el-form label-width="120px" :rules="addFormRules" :model="changeForm" ref="changeForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="changeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldpwd">
          <el-input type="password" v-model="changeForm.oldpwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input type="password" v-model="changeForm.newpwd"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="renewpwd">
          <el-input type="password" v-model="changeForm.renewpwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submit('changeForm')" type="primary">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
require("echarts/theme/dark");
import { updatePsw, changeUsername, logout } from "../../api/api";
import md5 from "md5";
export default {
  name: "changePwd",
  data() {
    return {
      loginname: JSON.parse(this.$store.getters.userdata).logname,
      userid: JSON.parse(this.$store.getters.userdata).id,
      userinfo: JSON.parse(this.$store.getters.userdata),
      changeForm: {},
      addFormRules: {
        // username: [
        //   // { required: true, message: "用户名不能为空", trigger: "change" },
        //   {
        //     validator: (rule, value, callback) => {
        //       if (value) {
        //         // changeUsername({ logname: this.changeForm.username }, data => {
        //         //   if(data.data.code==0){
        //         //     callback();
        //         //   }else{
        //         //     callback(data.data.msg);
        //         //   }
        //         //   // console.log(data)
        //         //   // if (value !== this.changeForm.newpwd) {
        //         //   //   callback("两次输入密码不一致");
        //         //   // } else {
        //         //   //   callback();
        //         //   // }
        //         // });
        //       } else {
        //         callback("用户名不能为空");
        //       }
        //     }
        //   }
        // ],
        oldpwd: [
          { required: true, message: "请输入旧密码", trigger: "change" }
        ],
        newpwd: [
          { required: true, message: "请输入新密码", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value !== this.changeForm.oldpwd) {
                  callback();
                } else {
                  callback("不能与旧密码一样");
                }
              } else {
                callback("请输入新密码");
              }
            }
          }
        ],
        renewpwd: [
          { required: true, message: "确认新密码", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value !== this.changeForm.newpwd) {
                  callback("两次输入密码不一致");
                } else {
                  callback();
                }
              } else {
                callback("请确认新密码");
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.changeForm.username = this.loginname;
  },
  methods: {
    submit() {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          this.$confirm(
            "<span style='color:#f00;'>修改密码后需重新登录，</span>确认修改吗？",
            "提示",
            {
              dangerouslyUseHTMLString: true,
              type: "warning",
              center: true,
              modal: true,
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          ).then(() => {
            let para = { id: this.userid, logname: this.changeForm.username };
            para.oldPassword = md5(this.changeForm.oldpwd);
            para.newPassword = md5(this.changeForm.newpwd);
            updatePsw(
              para,
              res => {
                if (res.data.code === "0") {
                  this.$message({
                    message: "修改成功，请重新登录！",
                    type: "success"
                  });
                  logout("", ({ data: { code, msg } }) => {
                    if (code === "0") {
                      sessionStorage.removeItem("token");
                      location.reload();
                    }
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
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.changepsw {
  .el-input {
    width: 300px;
  }
  .change {
    margin-top: 50px;
  }
}
</style>
