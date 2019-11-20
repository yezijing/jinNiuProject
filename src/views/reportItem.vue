<template>
  <div>
    <el-dialog
      title="新增进展填报"
      :visible.sync="reportVisible.visible"
      width="1200px"
      class="report-dialog"
      @close="resetBtnFuc"
    >
      <el-row :gutter="20" class="report-wrap">
        <el-col :span="14">
          <fieldset>
            <legend>基本信息</legend>
            <div style="padding:15px;">
              <report-basicinfo :itemShow="itemShow" :reportBasic="reportBasic"></report-basicinfo>
            </div>
          </fieldset>
        </el-col>
        <el-col :span="10">
          <fieldset>
            <legend>进展填报</legend>
            <div style="padding:15px;">
              <el-form
                :model="reportData"
                size="small"
                label-width="125px"
                ref="reportData"
                :append-to-body="true"
              >
                <el-form-item label="上次进展情况：" prop="laststate">
                  <el-input
                    type="textarea"
                    readonly
                    :autosize="{ minRows: 3, maxRows:5}"
                    v-model="laststate"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="进展情况："
                  prop="question"
                  :rules="[{ required: true, message: '请输入进展情况', trigger:'blur'}]"
                >
                  <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.question"></el-input>
                </el-form-item>
                <el-form-item
                  label="存在问题："
                  prop="wenti"
                  :rules="[{ required: true, message: '请输入存在问题', trigger:'blur'}]"
                >
                  <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.wenti"></el-input>
                </el-form-item>
                <el-form-item
                  label="下步工作计划："
                  prop="measure"
                  :rules="[{ required: true, message: '请输入下步工作计划', trigger:'blur'}]"
                >
                  <el-input type="textarea" :autosize="{ minRows: 3}" v-model="reportData.measure"></el-input>
                </el-form-item>
                <el-form-item
                  label="自我评价："
                  prop="remark"
                  :rules="[{ required: true, message: '请选择', trigger:'blur'}]"
                >
                  <el-radio-group v-model="reportData.remark" @change="selectChange">
                    <el-radio :label="0">正常</el-radio>
                    <el-radio :label="1">滞后</el-radio>
                    <el-radio :label="2">严重滞后</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class="upbox">
                  <el-upload
                    class="upload-demo"
                    :action="upfile"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :on-preview="handlePreview"
                    :before-remove="beforeRemove"
                    :file-list="fileList"
                    ref="upload"
                  >
                    <el-button size="small" type="primary">上传附件</el-button>
                  </el-upload>
                </div>
              </el-form>
            </div>
          </fieldset>
        </el-col>
      </el-row>
      <div class="export-btn">
        <el-button size="small" :disabled="isExport.visible" @click="exportData" type="primary">导出数据</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveReport()" size="small" type="primary">保 存</el-button>
        <el-button @click="submitReport()" size="small" type="primary">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { upfile, imgIp, importProjectList } from "../api/imgUrl";
import { defaturl } from "../api/apiUrl";
import { projectImportFileData } from "../api/api";
import {
  addProjectReportData,
  saveReportInfo,
  addAssignReport,
  addPlanReport,
  addKeyareaReport,
  addItemReport,
  addKeyworkReport,
  addImportworkReport
} from "../api/reportApi";
import {
  projectPassStatus,
  assignPassStatus,
  synchFormstate
} from "../api/center";

import reportBasicinfo from "./reportBasicinfoItem"; //基本信息
export default {
  components: { reportBasicinfo },
  props: [
    "reportVisible",
    "workid",
    "itemShow",
    "reportBasic",
    "laststate",
    "reportData",
    "fileArr",
    "fileList",
    "isExport"
  ],
  data() {
    return {
      upfile: "",
      imgIp: "",
      defaturl: "",
      loginid: JSON.parse(this.$store.getters.userdata).id
    };
  },
  created() {
    this.upfile = upfile;
    this.imgIp = imgIp;
    this.defaturl = defaturl;
  },
  watch: {
    reportVisible: function(newValue, oldValue) {
      this.$emit("update:reportVisible", newValue);
    },
    reportData: function(newValue, oldValue) {
      this.$emit("update:reportData", newValue);
    },
    fileArr: function(newValue, oldValue) {
      this.$emit("update:fileArr", newValue);
    },
    fileList: function(newValue, oldValue) {
      this.$emit("update:fileList", newValue);
    },
    isExport: function(newValue, oldValue) {
      this.$emit("update:isExport", newValue);
    }
  },
  methods: {
    handlePreview(file) {
      console.log(file);
      var urls = this.imgIp + file.response.obj;
      console.log(urls);
      window.open(urls);
    },
    // 提交
    submitReport() {
      this.$refs.reportData.validate(valid => {
        if (valid) {
          let files = "";
          if (this.fileArr == []) {
            files = "";
          } else {
            files = this.fileArr.join(",");
          }
          var para = this.reportData;
          para.filepath = files;
          para.validate = 0;
          para.userid = this.loginid;
          if (this.itemShow == 1) {
            //重点项目
            para.projectid = this.workid;
            addProjectReportData(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
              projectPassStatus({ pid: this.workid }, data => {});
            });
          } else if (this.itemShow == 2) {
            //批交办
            para.checkid = this.workid;
            addAssignReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
              assignPassStatus({ cid: this.workid }, data => {});
            });
          } else if (this.itemShow == 3) {
            //三年行动计划
            para.typemodel = 1;
            para.workid = this.workid;
            addPlanReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
              synchFormstate({ workid: this.workid, typemodel: 1 }, data => {});
            });
          } else if (this.itemShow == 4) {
            //现场办公会
            para.typemodel = 2;
            para.workid = this.workid;
            addPlanReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
              synchFormstate({ workid: this.workid, typemodel: 2 }, data => {});
            });
          } else if (this.itemShow == 7) {
            //重要工作
            para.workid = this.workid;
            addKeyworkReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
            });
          } else if (this.itemShow == 8) {
            //重要片区
            para.workid = this.workid;
            addKeyareaReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
            });
          } else if (this.itemShow == 9) {
            //重大项目
            para.situationid = this.workid;
            addItemReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
            });
          } else if (this.itemShow == 10) {
            //重点工作 12
            para.pointid = this.workid;
            addKeyworkReport(para, data => {
              this.alertFuc();
              this.reportVisible.visible = false;
              this.$emit("getAllList-event");
            });
          }
        } else {
          return;
        }
      });
    },
    // 保存
    saveReport() {
      this.$refs.reportData.validate(valid => {
        if (valid) {
          let files = "";
          if (this.fileArr.length == 0) {
            files = "";
          } else {
            files = this.fileArr.join(",");
          }
          let para = this.reportData;
          if (this.reportid !== -1) {
            para.id = this.reportid;
          }
          para.modeltype = this.itemShow;
          para.filepath = files;
          para.termid = this.workid;
          para.problem = this.reportData.wenti;
          para.plan = this.reportData.measure;
          saveReportInfo(para, data => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.isExport.visible = false;
          });
        }
      });
    },
    resetBtnFuc() {},
    // 导出数据
    exportData() {
      if (this.itemShow == 7) {
        window.open(
          this.defaturl +
            "/tripleWorkProgress/tripleWorkReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 8) {
        window.open(
          this.defaturl +
            "/tripleAreaProgress/tripleAreaReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 9) {
        window.open(
          this.defaturl +
            "/yy/importSituationProgressExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 3) {
        window.open(
          this.defaturl +
            "/report/threeReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 4) {
        window.open(
          this.defaturl +
            "/report/indicateReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 10) {
        window.open(
          this.defaturl +
            "/report/pointReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=10"
        );
      } else if (this.itemShow == 1) {
        window.open(
          this.defaturl +
            "/report/projectReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      } else if (this.itemShow == 2) {
        window.open(
          this.defaturl +
            "/report/checkReportExport?userid=" +
            this.loginid +
            "&termid=" +
            this.workid +
            "&modeltype=" +
            this.itemShow
        );
      }
    },
    // 添加附件 移除
    handleRemove(file, fileList) {
      var name = file.name;
      this.fileArr.splice(this.removeArr(this.fileArr, name), 1);
    },
    // 添加附件 移除前提示
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 添加附件 状态改变时
    handleSuccess(file, fileList) {
      let name = file.obj;
      this.fileArr.push(name);
    },
    selectChange() {
      this.$forceUpdate();
    },
    alertFuc() {
      this.$alert(
        "<span style='color:#f00;'>报送成功</span>，请等待上级部门审核通过",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "我知道了",
          type: "success",
          center: true,
          modal: false
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.report-dialog {
  .report-wrap {
    display: flex;
    align-items: stretch;
    fieldset {
      height: 100%;
    }
  }
  .el-dialog__body {
    padding-bottom: 10px;
  }
  .export-btn {
    padding: 10px 36px 0;
    text-align: right;
  }
}
</style>
