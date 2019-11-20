<template>
  <div class="reportinfo">
    <el-row :gutter="20" class="report-wrap">
      <el-col :span="14">
        <fieldset>
          <legend>基本信息</legend>
          <div style="padding:15px;">
            <!-- 项目 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==1"
            >
              <el-form-item label="项目名称：" prop="projectName">
                <el-input v-model="reportBasic.projectName" readonly></el-input>
              </el-form-item>
              <el-form-item label="项目业主：" prop="ownName">
                <el-input v-model="reportBasic.ownName" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="arealeaderNames">
                <el-input v-model="reportBasic.arealeaderNames" readonly></el-input>
              </el-form-item>
              <el-form-item label="所属街道：" prop="streets">
                <el-input v-model="reportBasic.streets" readonly></el-input>
              </el-form-item>
              <el-form-item label="项目类别：" prop="category">
                <el-input v-model="reportBasic.category" readonly></el-input>
              </el-form-item>
              <el-form-item label="项目地址：" prop="address">
                <el-input readonly v-model="reportBasic.address"></el-input>
              </el-form-item>
              <el-form-item label="报送要求：" prop="submitres">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1}"
                  readonly
                  v-model="reportBasic.submitres"
                ></el-input>
              </el-form-item>
              <el-form-item label="项目描述：" prop="remark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1}"
                  readonly
                  v-model="reportBasic.remark"
                ></el-input>
              </el-form-item>
              <el-form-item label="目标任务：" prop="aimplan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1}"
                  readonly
                  v-model="reportBasic.aimplan"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 批交办 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==2"
            >
              <el-form-item label="编号：" prop="code">
                <el-input readonly v-model="reportBasic.code"></el-input>
              </el-form-item>
              <el-form-item label="立项时间：" prop="starttime">
                <el-date-picker
                  v-model="reportBasic.starttime"
                  readonly
                  type="date"
                  class="el-input-datebox"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="任务来源：" prop="tasksource">
                <el-input readonly v-model="reportBasic.tasksource"></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leadername">
                <el-input readonly v-model="reportBasic.leadername"></el-input>
              </el-form-item>
              <el-form-item label="工作要求：" prop="jobrequire">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5}"
                  readonly
                  v-model="reportBasic.jobrequire"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 三年行动计划 && 领导指示分工 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="120px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==3||itemShow==4"
            >
              <el-form-item label="年度：" prop="yearname">
                <el-input v-model="reportBasic.yearname" readonly></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==3?'一级工作：':'工作要求：'" prop="bigname">
                <el-input v-model="reportBasic.bigname" readonly></el-input>
              </el-form-item>
              <el-form-item label="二级工作：" prop="minname">
                <el-input v-model="reportBasic.minname" readonly></el-input>
              </el-form-item>
              <el-form-item label="三级工作：" prop="partname">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                  readonly
                  v-model="reportBasic.partname"
                ></el-input>
              </el-form-item>
              <el-form-item label="督查单位：" prop="superdept">
                <el-input v-model="reportBasic.superdept" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==3?'工作计划：':'推进内容(重点)：'" prop="workname">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                  readonly
                  v-model="reportBasic.workname"
                ></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==3?'节点安排：':'任务计划：'" prop="nodeplan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                  readonly
                  v-model="reportBasic.nodeplan"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 向上分工 && 我区分工 -->
            <!-- <el-form :model="reportBasic" size="small" label-width="110px" ref="reportBasic" :append-to-body="true" v-if="itemShow==5||itemShow== 6" >
              <el-form-item label="年度：" prop="year">
                <el-input v-model="reportBasic.year" readonly></el-input>
              </el-form-item>
              <el-form-item label="督查单位：" prop="superdept">
                <el-input v-model="reportBasic.superdept" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="arealeadnames" class="qt">
                <el-input v-model="reportBasic.arealeadnames" readonly></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==5?'恳请协调解决事项：':'协调解决事项：'" prop="nodeplan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  readonly
                  v-model="reportBasic.nodeplan"
                ></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==5?'工作安排：':'市上总体安排：'" prop="workname">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  readonly
                  v-model="reportBasic.workname"
                ></el-input>
              </el-form-item>
            </el-form> -->
            <!-- 重要工作 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==7"
            >
              <el-form-item label="年度：" prop="yearname">
                <el-input v-model="reportBasic.yearname" readonly></el-input>
              </el-form-item>
              <el-form-item label="任务名称：" prop="workname">
                <el-input v-model="reportBasic.workname" readonly></el-input>
              </el-form-item>
              <el-form-item label="重要时间节点：" prop="nodeplan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows:10 }"
                  readonly
                  v-model="reportBasic.nodeplan"
                ></el-input>
              </el-form-item>
              <el-form-item label="督查单位：" prop="secondwork">
                <el-input readonly v-model="reportBasic.secondwork"></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 重要片区 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==8"
            >
              <el-form-item label="年度：" prop="yearname">
                <el-input v-model="reportBasic.yearname" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item label="具体片区：" prop="nodeplan">
                <el-input v-model="reportBasic.nodeplan" readonly></el-input>
              </el-form-item>
              <el-form-item label="项目名称：" prop="workname">
                <el-input readonly v-model="reportBasic.workname"></el-input>
              </el-form-item>
              <el-form-item label="重要时间节点：" prop="timenode">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRow: 10}"
                  readonly
                  v-model="reportBasic.timenode"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 重点项目 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==9"
            >
              <el-form-item label="年度：" prop="yearname">
                <el-input v-model="reportBasic.yearname" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item label="项目名称：" prop="projectname">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3}"
                  readonly
                  v-model="reportBasic.projectname"
                ></el-input>
              </el-form-item>
              <el-form-item label="重要时间节点：" prop="timenode">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3}"
                  readonly
                  v-model="reportBasic.timenode"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly type="textarea" :autosize="{ minRows: 1, maxRows:3}" ></el-input>
              </el-form-item>
            </el-form>
            <!-- 新增重点工作 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==10"
            >
              <el-form-item label="年度：" prop="yearname">
                <el-input v-model="reportBasic.yearname" readonly></el-input>
              </el-form-item>
              <el-form-item label="重点工作：" prop="bigname">
                <el-input v-model="reportBasic.bigname" readonly></el-input>
              </el-form-item>
              <el-form-item label="具体任务：" prop="minname">
                <el-input v-model="reportBasic.minname" readonly></el-input>
              </el-form-item>
              <el-form-item label="任务名称：" prop="workname">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 4}"
                  readonly
                  v-model="reportBasic.workname"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" type="textarea" :autosize="{ minRows: 1, maxRows:3}" readonly></el-input>
              </el-form-item>
            </el-form>
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
                <el-input type="textarea" readonly :autosize="{ minRows: 3, maxRows:5}" v-model="laststate"></el-input>
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
                  :before-remove="beforeRemove"
                  :on-preview="handlePreview"
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
      <el-button size="small" :disabled="isExport" @click="exportData" type="primary">导出数据</el-button>
    </div>
  </div>
</template>
 
<script>
import { defaturl } from "../api/apiUrl";
import { upfile, imgIp } from "../api/imgUrl";
export default {
  name: "report",
  props: [
    "reportBasic",
    "reportVisible",
    "reportData",
    "fileArr",
    "fileList",
    "upfile",
    "laststate",
    "itemShow",
    "isExport",
    "workid"
  ],
  components: {},
  data() {
    return {
      loginid: JSON.parse(this.$store.getters.userdata).id,
      defaturl:"",
      imgIp:""
    };
  },
  created() {
    this.defaturl = defaturl;
    this.imgIp = imgIp;
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
    // 导出数据
    exportData() {
      if(this.itemShow==7){
        window.open(this.defaturl + "/tripleWorkProgress/tripleWorkReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==8){
        window.open(this.defaturl + "/tripleAreaProgress/tripleAreaReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==9){
        window.open(this.defaturl + "/yy/importSituationProgressExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==3){
        window.open(this.defaturl + "/report/threeReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==4){
        window.open(this.defaturl + "/report/indicateReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==10){
        window.open(this.defaturl + "/report/pointReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype=12");
      }else if(this.itemShow==1){
        window.open(this.defaturl + "/report/projectReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }else if(this.itemShow==2){
        window.open(this.defaturl + "/report/checkReportExport?userid="+this.loginid+"&termid="+this.workid+"&modeltype="+this.itemShow);
      }
    },
    handlePreview(file,fileList){
      console.log(file)
      console.log(this.imgIp)
      var urls = this.imgIp + file.name;
      window.open(urls)
    },
    selectChange() {
      this.$forceUpdate();
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
    }
  }
};
</script>

<style lang="scss" scope>
.export-btn {
  padding: 10px 36px 0;
  text-align: right;
}
.el-dialog__body {
  padding-bottom: 10px;
}
</style>
