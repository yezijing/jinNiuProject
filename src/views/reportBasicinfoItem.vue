<template>
  <div>
    <!-- 重点项目 -->
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
        <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.remark"></el-input>
      </el-form-item>
      <el-form-item label="目标任务：" prop="aimplan">
        <el-input type="textarea" :autosize="{ minRows: 1}" readonly v-model="reportBasic.aimplan"></el-input>
      </el-form-item>
      <el-form-item label="牵头单位：" prop="leaderDeptName">
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
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
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
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
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
      </el-form-item>
    </el-form>
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
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
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
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
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
        <el-input type="textarea" :autosize="{ minRows: 3}" readonly v-model="reportBasic.timenode"></el-input>
      </el-form-item>
      <el-form-item label="牵头单位：" prop="leaderDeptName">
        <el-input
          v-model="reportBasic.leaderDeptName"
          readonly
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
        ></el-input>
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
      <el-form-item label="牵头单位：" prop="leaderDeptName">
        <el-input
          v-model="reportBasic.leaderDeptName"
          type="textarea"
          :autosize="{ minRows: 1, maxRows:3}"
          readonly
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["itemShow", "reportBasic"],
  data() {
    return {};
  },
  created() {},
  watch: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
