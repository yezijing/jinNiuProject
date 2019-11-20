<template>
  <div class="target keyrank">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form size="small" :inline="true" :model="filters" ref="filters">
          <el-form-item label="指标名称：" prop="economicId" class="lb">
            <el-select
              v-model="filters.economicId"
              placeholder="请选择"
              filterable
              clearable
              @change="selectChange"
            >
              <el-option
                v-for="item in indexNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="填报月份：" prop="reportMonth" class="ybox">
            <el-select
              v-model="filters.reportMonth"
              placeholder="请选择"
              filterable
              clearable
              @change="selectChange()"
            >
              <el-option
                v-for="item in months"
                :key="item.reportMonth"
                :label="item.month"
                :value="item.reportMonth"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="牵头区领导：" prop="leadleaderid" class="ld" v-if="toolShow">
            <el-select
              v-model="filters.leadleaderid"
              clearable
              placeholder="全部"
              @change="selectChange"
            >
              <el-option
                v-for="item in leaderList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="牵头单位：" prop="leadDeptId" class="ld" v-if="toolShow">
            <el-select
              v-model="filters.leadDeptId"
              clearable
              placeholder="全部"
              @change="selectChange"
            >
              <el-option
                v-for="item in leadunits"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
            <el-button @click="resetForm('filters')">重 置</el-button>
            <el-button @click="moreSearch">{{moreText}}</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <p class="etitle">{{monthDates}}</p>
    <el-row>
      <el-table
        class="tableinfo"
        border
        :height="tableHeight"
        :data="assignDatas"
        highlight-current-row
        style="width: 100%;"
        v-loading="loading"
      >
        <el-table-column prop="economicName" label="指标名称" fixed>
          <template slot-scope="scope">
            <div
              class="title"
              @click="transName(scope.row,scope.row.economicName, scope.row.economicid, scope.row.reportMonth); dataContrast()"
            >{{scope.row.economicName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="cytarget" label="市下达全年目标"></el-table-column>
        <!-- <el-table-column prop="drtarget" label="区定排位目标" width="70"></el-table-column> -->
        <el-table-column label="目标完成额">
          <el-table-column prop="amount" label="绝对量"></el-table-column>
          <el-table-column prop="amountfiverank" label="五区排名"></el-table-column>
          <el-table-column prop="amountcentralrank" width="70" label="中心城区排名"></el-table-column>
          <el-table-column prop="amountcityrank" label="全市排名"></el-table-column>
          <el-table-column prop="amplify" label="增幅(%)">
            <template slot-scope="scope">
              <span v-if="scope.row.amplify == null">/</span>
              <span
                v-else
                :style="scope.row.amplify < 0 ? 'color:#f00':'color:#606266'"
              >{{scope.row.amplify}}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="amplifyfiverank" label="五区排名"></el-table-column>
          <el-table-column prop="amplifycentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="amplifycityrank" label="全市排名"></el-table-column>
        </el-table-column>
        <el-table-column label="目标完成率">
          <el-table-column prop="fschedule" label="完成进度">
            <template slot-scope="scope">
              <span
                :style="scope.row.fschedule <0 ? 'color:#f00':'color:#606266'"
              >{{scope.row.fschedule}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fschedulefiverank" label="五城区排名"></el-table-column>
          <el-table-column prop="fschedulecentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="fschedulecityrank" label="全市排名"></el-table-column>
          <!-- <el-table-column prop="overtarget" width="60" label="超目标百分点">
            <template slot-scope="scope">
              <span v-html="smallFormat(scope,scope.row.overtarget)"></span>
              <p></p>
            </template>
          </el-table-column>
          <el-table-column prop="overtargetfiverank" width="70" label="五城区排名"></el-table-column>
          <el-table-column prop="overtargetcentralrank" width="70" label="中心城区排名"></el-table-column>
          <el-table-column prop="overtargetcityrank" width="60" label="全市排名"></el-table-column>-->
        </el-table-column>
        <!-- <el-table-column prop="ismeetsc" label="是否达到市下目标进度要求" width="80">
          <template slot-scope="scope">
            <span v-html="requireFormat(scope,scope.row.ismeetsc)"></span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column prop="budgetaryperformance" label="预计完成情况"></el-table-column> -->
        <el-table-column prop="leadDeptName" label="牵头单位"></el-table-column>
        <el-table-column prop="leadLeaderName" label="牵头区领导"></el-table-column>
        <!-- <el-table-column prop="leaddeptids" label="市上通报节点" width="80">
          <template slot-scope="scope">
            <span v-html="nodeFormat(scope,scope.row.leaddeptids)"></span>
          </template>
        </el-table-column>-->
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { alldeptList } from "../../api/api";
import { keyRank, getContrastList, getMonthlist } from "../../api/targetApi2";
import nameBus from "@/components/nameBus.js";
export default {
  name: "target",
  props: ["leaderList", "indexNames"],
  components: {},
  data() {
    return {
      leadunits: [], //牵头单位列表
      filters: {},
      currentPage: 1,
      pageSize: 10,
      totals: 20,
      loading: false,
      // 表格数据
      assignDatas: [],
      indexName: "",
      economicId: "",
      contrastList: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isAddShow: false,
      isDownShow: false,
      tableHeight: "500px", //设置表格高度
      months: [],
      moreText: "更多搜索条件",
      toolShow: false,
      isOpen: 0,
      reportMonth: "",
      monthDate: "",
      filts: {},
      monthDates:''
    };
  },
  mounted() {},
  created() {
    this.browerHeight();
    this.passValue();
    this.getDeptlist();
    this.getKeyRank();
    this.monthList();
  },
  methods: {
    // 展开更多搜索条件
    moreSearch() {
      if (this.isOpen == 0) {
        this.isOpen = 1;
        this.toolShow = true;
        this.moreText = "收回";
      } else {
        this.isOpen = 0;
        this.toolShow = false;
        this.moreText = "更多搜索条件";
      }
    },
    // 获取月份时间段
    monthList() {
      getMonthlist("", data => {
        this.months = data.data.obj;
        for (var i = 0; i < this.months.length; i++) {
          this.months[i].month = this.months[i].reportMonth + "月";
        }
      });
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.leadunits = data.data.obj;
      });
    },
    passValue() {
      if (this.targetCheckList !== null) {
        for (var i = 0; i < this.targetCheckList.length; i++) {
          let value = this.targetCheckList[i];
          switch (value) {
            case "D-add":
              this.isAddShow = true;
              break;
            case "D-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 360;
      this.tableHeight = hh + "px";
    },
    selectChange() {
      this.$forceUpdate();
    },
    getKeyRank() {
      keyRank("", data => {
        this.assignDatas = data.data.obj;
        if (this.assignDatas == null) {
          this.monthDate = "";
          this.monthDates = "";
          this.filters.reportMonth = "";
          this.filters.month = "";
        } else {
          for (var i = 0; i < this.assignDatas.length; i++) {
            this.assignDatas[i].month =
              this.assignDatas[i].reportMonth + "月";
          }
          this.monthDate = this.assignDatas[0].reportMonth;
          this.monthDates = this.assignDatas[0].month;
          this.filters.reportMonth = this.monthDate;
        }
      });
    },
    // 是否达到要求
    requireFormat(scope, value) {
      switch (value) {
        case 0:
          return "是";
          break;
        case 1:
          return "否";
          break;
      }
    },
    // 通报节点
    nodeFormat(scope, value) {
      switch (value) {
        case 0:
          return "月度";
          break;
        case 1:
          return "季度";
          break;
        case 2:
          return "半年";
          break;
        case 3:
          return "年度";
          break;
      }
    },
    // 搜索
    getDatas: function() {
      var para = this.filters;
      var { reportMonth, ...others } = para;
      para = others;
      var mon = this.filters.reportMonth;
      if (mon == undefined) {
        mon = "";
      } else {
        mon = mon.replace("月", "");
        para.reportMonth = mon;
      }
      keyRank(para, data => {
        this.assignDatas = data.data.obj;
        if (this.assignDatas == null) {
          this.monthDate = "";
        } else {
          for (var i = 0; i < this.assignDatas.length; i++) {
            this.assignDatas[i].reportMonth =
              this.assignDatas[i].reportMonth + "月";
          }
          if (this.filters.reportMonth == "") {
            this.monthDate = "";
          } else {
            this.monthDate = this.assignDatas[0].reportMonth;
          }
        }
        this.loading = false;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getKeyRank();
    },
    // 传指标名称、id到对比表
    transName(row, name, id, reportMonth) {
      this.indexName = name;
      this.economicId = id;
      this.reportMonth = reportMonth;
      this.filts.reportMonth = this.reportMonth;
      this.filts.economicId = id;
      this.filts.month = this.reportMonth+'月';
      nameBus.$emit("name", this.indexName);
      nameBus.$emit("id", this.economicId);
      nameBus.$emit("filters", this.filts);
      nameBus.$emit("reportMonth", this.reportMonthh);
    },
    // 点击指标名称进入对比表
    getContrast() {
      let para = { economicId: this.economicId };
      getContrastList(para, data => {
        this.contrastList = data.data.obj;
        nameBus.$emit("clist", this.contrastList);
      });
    },
    dataContrast() {
      this.$emit("my-event");
      this.getContrast();
    }
  }
};
</script>

<style lang="scss">
.toolbar {
  .ww1 {
    .el-select {
      width: 120px;
    }
  }
  .ww2 {
    margin-right: 50px;
  }
  .el-form-item.ybox .el-input__inner {
    width: 100px;
  }
}
.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid #ccc;
}
.el-table th > .cell {
  word-break: break-word;
}

.keyrank {
  .toolbar {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 120px;
    }
    .el-form--inline .ybox {
      margin-right: 5px;
    }
  }
  .etitle {
    text-align: center;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
