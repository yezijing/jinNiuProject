<template>
  <div class="content-wrap setup">
    <p class="navtitle">
      <span>系统设置</span>
    </p>
    <div class="setwrap">
      <div class="sleft">
        <el-form ref="setForm" :model="setForm" label-width="180px" size="small">
          <el-form-item label="系统LOGO：">
            <el-input v-model="slogo" placeholder="请上传"></el-input>
          </el-form-item>
          <p class="ts">建议：上传背景为透明色格式为png的图片</p>
          <el-form-item label="系统首页背景图：">
            <el-input v-model="sbg" placeholder="请上传"></el-input>
          </el-form-item>
          <p class="ts">建议：背景请上传高清图</p>
          <el-form-item label="系统名称：" prop="systemname">
            <el-input v-model="setForm.systemname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="单位名称：" prop="unitname">
            <el-input v-model="setForm.unitname" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item class="sbtn">
            <el-button @click="saveData" type="primary">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="sright">
        <div class="list">
          <el-upload
            class="avatar-uploader"
            :action="upfile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <el-button type="primary" size="small">上传图片</el-button>
            <img v-if="logoUrl" :src="logoUrl" class="avatar avatar2">
          </el-upload>
        </div>
        <div class="list">
          <el-upload
            class="avatar-uploader"
            :action="upfile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
          >
            <el-button type="primary" size="small">上传图片</el-button>
            <img v-if="bgUrl" :src="bgUrl" class="avatar">
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { upfile, imgIp } from "../../api/imgUrl";
import { systemSetting, systemDetail, logout } from "../../api/api";
export default {
  name: "setup",
  data() {
    return {
      logoUrl: "",
      bgUrl: "",
      setForm: {},
      slogo: "",
      sbg: "",
      upfile: "",
      imgIp: ""
    };
  },
  created() {
    this.systemList();
  },
  methods: {
    // 背景
    handleAvatarSuccess2(res, file) {
      this.bgUrl = URL.createObjectURL(file.raw);
      this.sbg = file.response.obj;
      console.log(file);
    },
    beforeAvatarUpload2(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("请上传 JPG 格式的图片!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 系统logo
    handleAvatarSuccess(res, file) {
      this.logoUrl = URL.createObjectURL(file.raw);
      this.slogo = file.response.obj;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("请上传 JPG 格式的图片!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 查询
    systemList() {
      systemDetail("", data => {
        console.log(data);
        this.upfile = upfile;
        this.imgIp = imgIp;
        this.logoUrl = this.imgIp + data.data.obj.logoname;
        this.bgUrl = this.imgIp + data.data.obj.backgroundname;
        this.setForm.systemname = data.data.obj.systemname;
        this.setForm.unitname = data.data.obj.unitname;
        this.sbg = data.data.obj.backgroundname;
        this.slogo = data.data.obj.logoname;
        this.systemname = data.data.obj.systemname;
        this.logoimg = this.logoUrl;
      });
    },
    // 提交
    saveData() {
      let para = {};
      para.systemname = this.setForm.systemname;
      para.backgroundname = this.sbg;
      para.logoname = this.slogo;
      para.unitname = this.setForm.unitname;
      systemSetting(para, data => {
        this.$confirm("修改成功，需要退出登录才能生效，确认现在退出吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
            logout("", ({ data: { code, msg } }) => {
              if (code === "0") {
                sessionStorage.removeItem("token");
                location.reload();
              }
            });
          }).catch(() => {
            this.$message({
              type: "info",
              message: "取消重新登录，修改将在下次登录生效！"
            });
          });
        this.systemList();
      });
    }
  }
};
</script>

<style lang="scss">
.setup {
  .setwrap {
    margin-top: 40px;
    display: flex;
    .sleft {
      width: 520px;
      .sbtn {
        margin-top: 40px;
      }
    }
    .sright {
      padding-left: 30px;
      .list {
        margin-bottom: 20px;
        height: 132px;
        .avatar {
          width: 150px;
          height: 120px;
          margin-left: 15px;
        }
        .avatar2{
          width: 100px;max-height: 100px;height: auto;
        }
        .el-upload {
          display: flex;
          align-items: flex-start;
        }
      }
    }
    .el-form {
      width: 530px;
      .el-form-item {
        margin-bottom: 10px;
      }
      .ts {
        padding-left: 180px;
        font-size: 12px;
        color: #aaa;
        margin-bottom: 96px;
      }
    }
  }
}
</style>
