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
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.submitres"></el-input>
              </el-form-item>
              <el-form-item label="项目描述：" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.remark"></el-input>
              </el-form-item>
              <el-form-item label="目标任务：" prop="aimplan">
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.aimplan"></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
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
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.jobrequire"></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
              </el-form-item>
            </el-form>
            <!-- 三年行动计划 && 领导指示分工 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
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
                  :autosize="{ minRows: 1}"
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
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.workname"></el-input>
              </el-form-item>
              <el-form-item :label="itemShow==3?'节点安排：':'任务计划：'" prop="nodeplan">
                <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.nodeplan"></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
              </el-form-item>
            </el-form>
            <!-- 向上分工 && 我区分工 -->
            <el-form
              :model="reportBasic"
              size="small"
              label-width="110px"
              ref="reportBasic"
              :append-to-body="true"
              v-if="itemShow==5||itemShow== 6"
            >
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
            </el-form>

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
              <el-form-item label="重点工作：" prop="workname">
                <el-input v-model="reportBasic.workname" readonly></el-input>
              </el-form-item>
              <el-form-item label="一级任务：" prop="nodeplan">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2}"
                  readonly
                  v-model="reportBasic.nodeplan"
                ></el-input>
              </el-form-item>
              <el-form-item label="二级任务：" prop="secondwork">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3}"
                  readonly
                  v-model="reportBasic.secondwork"
                ></el-input>
              </el-form-item>
              <el-form-item label="责任领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
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
                  :autosize="{ minRows: 3}"
                  readonly
                  v-model="reportBasic.timenode"
                ></el-input>
              </el-form-item>
              <el-form-item label="牵头单位：" prop="leaderDeptName">
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
              </el-form-item>
            </el-form>
            <!-- 重大项目  -->
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
                <el-input v-model="reportBasic.leaderDeptName" readonly></el-input>
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
                <el-input type="textarea" :autosize="{ minRows: 4}" readonly v-model="reportBasic.workname"></el-input>
              </el-form-item>
              <el-form-item label="牵头区领导：" prop="leaders" class="qt">
                <el-input v-model="reportBasic.leaders" readonly></el-input>
              </el-form-item>
            </el-form>
          </div>
        </fieldset>
      </el-col>
      <el-col :span="10">
        <fieldset>
          <legend>进展情况</legend>
          <div style="padding:15px;">
            <el-form
              :model="examineData"
              size="small"
              label-width="125px"
              ref="examineData"
              :append-to-body="true"
            >
              <el-form-item label="上次进展情况：" prop="laststate">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 7}" v-model="laststate" readonly></el-input>
              </el-form-item>
              <el-form-item label="进展情况：" prop="question">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 7}"
                  v-model="examineData.question"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="存在问题：" prop="wenti">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 7}"
                  v-model="examineData.wenti"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="下步工作计划：" prop="measure">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 7}"
                  v-model="examineData.measure"
                  readonly
                ></el-input>
              </el-form-item>
              <el-form-item label="自我评价：" prop="remark">
                <el-radio-group v-model="examineData.remark" class="radio-disable">
                  <el-radio disabled :label="0">正常</el-radio>
                  <el-radio disabled :label="1">滞后</el-radio>
                  <el-radio disabled :label="2">严重滞后</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="不通过原因：" prop="reason" v-if="reasonShow">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2}"
                  readonly
                  v-model="examineData.reason"
                ></el-input>
              </el-form-item>
              <div class="upbox">
                <p class="t1">附件</p>
                <div class="files">
                  <a
                    v-for="(item, index) in examineFileArr"
                    target="_blank"
                    :key="index"
                    :href="item.url"
                  >{{index+1}}. {{item.name}}</a>
                  <p v-if="noneFile" class="t2">无</p>
                </div>
              </div>
              <div style="margin-top:20px;" v-if="zhihouShow">
                <el-form-item
                  label="是否滞后："
                  prop="isZhiHou"
                  :rules="[{ required: true, message: '请选择是否滞后', trigger: 'change' }]"
                >
                  <el-radio-group v-model="examineData.isZhiHou" class="zhihou" @change="selectChange">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </fieldset>
      </el-col>
    </el-row>
  </div>
</template>
 
<script>
export default {
  name: "report",
  props: [
    "reportBasic",
    "examineVisible",
    "examineData",
    "examineFileArr",
    "laststate",
    "itemShow",
    "zhihouShow",
    "noneFile",
    "reasonShow"
  ],
  components: {},
  data() {
    return {};
  },
  created() {},
  watch: {
    examineVisible: function(newValue, oldValue) {
      this.$emit("update:examineVisible", newValue);
    },
    examineData: function(newValue, oldValue) {
      this.$emit("update:examineData", newValue);
    }
  },
  methods: {
    selectChange() {
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
.radio-disable{
   .el-radio__input.is-disabled.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }
  .el-radio__input.is-disabled .el-radio__inner{
    background-color: #f5f7fa;
    border-color: #bbb;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner::after{background-color: #fff;}
  .el-radio__input.is-disabled+span.el-radio__label{color: #333;}
}
.zhihou{
  .el-radio__input.is-checked+.el-radio__label{
    color: #f00;
  }
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #f00;
    background: #f00;
  }
}
</style>
