<template>
  <div class="content-wrap target streetrank">
    <p class="navtitle">
      <span>承办单位完成情况</span>
    </p>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form size="small" :inline="true" :model="filters" ref="filters">
          <el-form-item label="填报月份：" prop="reportMonth" class="ybox">
            <el-select
              v-model="filters.reportMonth"
              placeholder="全部"
              filterable
              clearable
              @change="selectChange()"
            >
              <el-option
                v-for="item in months"
                :key="item.reportMonth"
                :label="item.reportMonth"
                :value="item.reportMonth"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="牵头区领导：" prop="leadleaderid" class="ld">
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
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
            <el-button @click="resetForm('filters')">重 置</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" size="small" @click="downLoadData" v-if="isDownShow">报表下载</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-row>
      <el-table
        class="tableinfo"
        stripe
        border
        :data="rankDatas"
        highlight-current-row
        :height="tableHeight"
        style="width: 100%;"
        :span-method="objectSpanMethod"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column label="承办单位">
          <el-table-column prop="deptName" label="名称" class-name="oneth"></el-table-column>
          <el-table-column prop="type" label="类别" class-name="oneth"></el-table-column>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in indexNames"
          :key="index"
          :prop="item.title"
          :label="item.name"
        ></el-table-column>
        <el-table-column prop="rate" label="达标率"></el-table-column>
        <el-table-column prop="rank" label="达标率排名"></el-table-column>
        <el-table-column prop="cytargetSum" label="承办指标项数"></el-table-column>
        <el-table-column prop="fscheduleSum" label="完成任务计划指标项数"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { otherRankList, getareaMonthlist } from "../../api/targetApi2";
import { allIndexlist } from "../../api/targetApi";
import { leaderList } from "../../api/api";
import { defaturl } from "../../api/apiUrl";
export default {
  name: "streetRank",
  components: {},
  data() {
    return {
      defaturl: "",
      rankDatas: [],
      indexNames: [],
      eid: "",
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isDownShow: false,
      loading: true,
      tableHeight: "500px", //设置表格高度
      lens: 0,
      lastlens: 0,
      ratelen: 0,
      ranklen: 0,
      leaderList: [], //牵头区领导
      filters: { reportMonth: "", leadleaderid: "" }, //搜索
      months: [] //月份
    };
  },
  mounted() {},
  created() {
    this.defaturl = defaturl;
    this.browerHeight();
    this.limitShow();
    this.streetRankList();
    this.getLeaderList();
    this.monthList();
  },
  methods: {
    // 报表下载
    downLoadData() {
      window.open(this.defaturl + '/report/streetFinishInfoReport?reportMonth='+ this.filters.reportMonth +'&leadleaderid=' + this.filters.leadleaderid);
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 搜索
    getDatas: function() {
      this.lens = 0;
      this.lastlens = 0;
      this.ratelen = 0;
      this.ranklen = 0;
      let para = this.filters;
      this.loading = true;
      this.indexNames = [];
      this.rankDatas = [];
      otherRankList(para, data => {
        this.loading = false;
        // 指标列表
        var datas = data.data.obj;
        var len1 = datas.tital.length - 2;
        var len2 = datas.tital.dataList.length;
        var alls = len1 + len2;
        this.lens = alls - 1;
        this.lastlens = alls - 2;
        this.ratelen = alls - 4;
        this.ranklen = alls - 3;
        var indexlist = datas.tital.dataList;
        for (var i = 0; i < indexlist.length; i++) {
          var obj = {};
          obj.title = "quota" + i;
          obj.name = indexlist[i];
          this.indexNames.push(obj);
        }
        var dlist = datas.dataList[0];
        var olist = datas.dataList[1];
        for (var j = 0; j < dlist.length; j++) {
          var robj = {};
          robj.deptName = dlist[j].deptName;
          robj.type = dlist[j].dataType;
          robj.type = dlist[j].dataType;
          robj.rate = dlist[j].controlRateString;
          robj.rank = dlist[j].controlRatesRank;
          robj.cytargetSum = dlist[j].dutyNum;
          robj.fscheduleSum = dlist[j].finishNum;
          var zbarr = dlist[j].dataList;
          for (var n = 0; n < zbarr.length; n++) {
            robj["quota" + n] = zbarr[n];
          }
          this.rankDatas.push(robj);
          var ovobj = {};
          ovobj.deptName = olist[j].deptName;
          ovobj.type = olist[j].dataType;
          ovobj.type = olist[j].dataType;
          ovobj.rate = olist[j].controlRateString;
          ovobj.rank = olist[j].controlRatesRank;
          ovobj.cytargetSum = olist[j].dutyNum;
          ovobj.fscheduleSum = olist[j].finishNum;
          var zbarr2 = olist[j].dataList;
          for (var m = 0; m < zbarr2.length; m++) {
            ovobj["quota" + m] = zbarr2[m];
          }
          this.rankDatas.push(ovobj);
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.streetRankList();
    },
    // 获取月份时间段
    monthList() {
      getareaMonthlist("", data => {
        this.months = data.data.obj;
      });
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderList = data.data.obj;
      });
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 320;
      this.tableHeight = hh + "px";
    },
    limitShow: function() {
      if (this.targetCheckList !== null) {
        for (var i = 0; i < this.targetCheckList.length; i++) {
          let value = this.targetCheckList[i];
          switch (value) {
            case "D-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    // 合并表格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === this.lens) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === this.lastlens) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === this.ranklen) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      } else if (columnIndex === this.ratelen) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 数据列表
    streetRankList() {
      this.loading = true;
      this.lens = 0;
      this.lastlens = 0;
      this.ratelen = 0;
      this.ranklen = 0;
      this.indexNames = [];
      this.rankDatas = [];
      otherRankList("", data => {
        this.loading = false;
        // 指标列表
        var datas = data.data.obj;
        var alls = datas.tital.dataList.length;
        alls = alls + 6;
        this.lens = alls - 1;
        this.lastlens = alls - 2;
        this.ratelen = alls - 4;
        this.ranklen = alls - 3;
        var indexlist = datas.tital.dataList;
        for (var i = 0; i < indexlist.length; i++) {
          var obj = {};
          obj.title = "quota" + i;
          obj.name = indexlist[i];
          this.indexNames.push(obj);
        }
        var dlist = datas.dataList[0];
        var olist = datas.dataList[1];
        var tdlist = datas.dataList[2];
        var tolist = datas.dataList[3];

        for (var j = 0; j < dlist.length; j++) {
          var robj = {};
          robj.deptName = dlist[j].deptName;
          robj.type = dlist[j].dataType;
          robj.type = dlist[j].dataType;
          robj.rate = dlist[j].controlRateString;
          robj.rank = dlist[j].controlRatesRank;
          robj.cytargetSum = dlist[j].dutyNum;
          robj.fscheduleSum = dlist[j].finishNum;
          var zbarr = dlist[j].dataList;
          for (var n = 0; n < zbarr.length; n++) {
            robj["quota" + n] = zbarr[n];
          }
          this.rankDatas.push(robj);
          var ovobj = {};
          ovobj.deptName = olist[j].deptName;
          ovobj.type = olist[j].dataType;
          ovobj.type = olist[j].dataType;
          ovobj.rate = olist[j].controlRateString;
          ovobj.rank = olist[j].controlRatesRank;
          ovobj.cytargetSum = olist[j].dutyNum;
          ovobj.fscheduleSum = olist[j].finishNum;
          var zbarr2 = olist[j].dataList;
          for (var m = 0; m < zbarr2.length; m++) {
            ovobj["quota" + m] = zbarr2[m];
          }
          this.rankDatas.push(ovobj);
        }

        for (var a = 0; a < tdlist.length; a++) {
          var arobj = {};
          arobj.deptName = tdlist[a].deptName;
          arobj.type = tdlist[a].dataType;
          arobj.type = tdlist[a].dataType;
          arobj.rate = tdlist[a].controlRateString;
          arobj.rank = tdlist[a].controlRatesRank;
          arobj.cytargetSum = tdlist[a].dutyNum;
          arobj.fscheduleSum = tdlist[a].finishNum;
          var zbarr = tdlist[a].dataList;
          for (var n = 0; n < zbarr.length; n++) {
            arobj["quota" + n] = zbarr[n];
          }
          this.rankDatas.push(arobj);
          var avobj = {};
          avobj.deptName = tolist[a].deptName;
          avobj.type = tolist[a].dataType;
          avobj.type = tolist[a].dataType;
          avobj.rate = tolist[a].controlRateString;
          avobj.rank = tolist[a].controlRatesRank;
          avobj.cytargetSum = tolist[a].dutyNum;
          avobj.fscheduleSum = tolist[a].finishNum;
          var zbarr2 = tolist[a].dataList;
          for (var m = 0; m < zbarr2.length; m++) {
            avobj["quota" + m] = zbarr2[m];
          }
          this.rankDatas.push(avobj);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.target {
  .toolbar {
    .ww2 {
      margin-right: 50px;
    }
  }
  .indexName {
    color: #666;
    font-size: 18px;
    font-family: "微软雅黑";
    margin-bottom: 30px;
  }
  .downwrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
.streetrank {
  .toolbar {
    .el-form--inline .ybox {
      margin-right: 5px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 150px;
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    font-weight: bold;
    background: #eee;
  }
}
</style>
