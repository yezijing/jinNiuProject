<template>
  <div class="target keyrank">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters" size="small">
          <el-form-item label="指标名称：" prop="economicId">
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
          <el-form-item>
            <el-button @click="getDatas('filters')" type="primary" size="small">搜 索</el-button>
            <el-button @click="resetForm('filters')" size="small">重 置</el-button>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <p class="etitle">{{indexName}}{{filters.month}}</p>
    <el-row>
      <el-table
        class="tableinfo"
        border
        :data="contrastList"
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
      >
        <el-table-column prop="districtName" label="区域"></el-table-column>
        <el-table-column prop="cytarget" label="市下达全年目标"></el-table-column>
        <el-table-column prop="drtarget" label="区定排位目标"></el-table-column>
        <el-table-column label="目标完成额">
          <el-table-column prop="amount" label="绝对量"></el-table-column>
          <el-table-column prop="amountfiverank" label="五区排名"></el-table-column>
          <el-table-column prop="amountcentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="amountcityrank" label="全市排名"></el-table-column>
          <el-table-column prop="amplify" label="增幅(%)"></el-table-column>
          <el-table-column prop="amplifyfiverank" label="五区排名"></el-table-column>
          <el-table-column prop="amplifycentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="amplifycityrank" label="全市排名"></el-table-column>
        </el-table-column>
        <el-table-column label="目标完成率">
          <el-table-column prop="fschedule" label="完成进度"></el-table-column>
          <el-table-column prop="fschedulefiverank" label="五城区排名"></el-table-column>
          <el-table-column prop="fschedulecentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="fschedulecityrank" label="全市排名"></el-table-column>
          <el-table-column prop="overtarget" label="超目标百分点"></el-table-column>
          <el-table-column prop="overtargetfiverank" label="五城区排名"></el-table-column>
          <el-table-column prop="overtargetcentralrank" label="中心城区排名"></el-table-column>
          <el-table-column prop="overtargetcityrank" label="全市排名"></el-table-column>
        </el-table-column>
        <!-- <el-table-column prop="ismeetsc" label="是否达到目标进度要求" width="80">
          <template slot-scope="scope">
            <span v-html="statusFormat(scope,scope.row.ismeetsc)"></span>
          </template>
        </el-table-column>-->
      </el-table>
    </el-row>
  </div>
</template>

<script>
import nameBus from "@/components/nameBus.js";
import { getContrastList, getMonthlist } from "../../api/targetApi2";
import { allIndexlist } from "../../api/targetApi";
export default {
  name: "target",
  components: {},
  props: ["indexNames"],
  data() {
    return {
      reportMonth: "",
      filters: {},
      indexName: "",
      economicId: "",
      contrastList: [],
      indexList: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isDownShow: false,
      months: [],
      month: "",
      yue:'',
      tableHeight: "500px" //设置表格高度
    };
  },
  mounted() {},
  created() {
    
    this.passValue();
    this.browerHeight();
    nameBus.$on("name", e => {
      this.indexName = e;
    });
    nameBus.$on("id", e => {
      this.economicId = e;
    });
    nameBus.$on("clist", e => {
      this.contrastList = e;
    });
    nameBus.$on("filters", e => {
      this.filters = e;
    });
    // nameBus.$on("reportMonth", e => {
    //   this.month = e;
    //   if (e == null) {
    //     this.reportMonth = "";
    //   } else {
    //     this.reportMonth = "（" + e + "）";
    //   }
    // });
    this.monthList();
    this.getIndexData();
  },
  watch: {
    filters: {
      handler(newValue, oldValue) {
        console.log(newValue);
      },
      deep: true
    }
  },
  methods: {
    // 获取月份时间段
    monthList() {
      getMonthlist("", data => {
        this.months = data.data.obj;
        for (var i = 0; i < this.months.length; i++) {
          this.months[i].month = this.months[i].reportMonth + "月";
        }
      });
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 350;
      this.tableHeight = hh + "px";
    },
    passValue() {
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
    selectChange() {
      this.$forceUpdate();
    },
    // 经济指标列表
    getIndexData() {
      allIndexlist("", data => {
        this.indexList = data.data.obj;
      });
    },
    getContrast(para) {
      getContrastList(para, data => {
        var eid = this.filters.economicId;
        // if(this.filters.reportMonth==undefined){
        //   this.remonth = ""
        // }else{
        //   this.remonth = this.filters.reportMonth;
        // }
        if (eid == undefined) {
          this.indexName = "";
        } else {
          for (var i = 0; i < this.indexNames.length; i++) {
            if (this.indexNames[i].id == eid) {
              this.indexName = this.indexNames[i].name;
            }
          }
        }
        this.contrastList = data.data.obj;
      });
    },
    // 是否达到要求
    statusFormat(scope, value) {
      switch (value) {
        case 0:
          return "是";
          break;
        case 1:
          return "否";
          break;
      }
    },
    // 搜索
    getDatas: function() {
      var para = this.filters;
      var { reportMonth, ...others } = para;
      para = others;
      var mon = "";
      if (this.filters.reportMonth == undefined) {
        mon = "";
      } else {
        mon = this.filters.reportMonth;
        mon = mon.replace("月", "");
        para.reportMonth = mon;
      }
      this.getContrast(para);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filters.economicId = "";
      this.filters.month = "";
      this.contrastList = [];
      this.reportMonth = "";
      this.indexName = "";
      this.remonth = "";
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
}
.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid #ccc;
}
.el-table th > .cell {
  word-break: break-word;
}

.target-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 30px;
  font-weight: bold;
}
.keyrank {
  .toolbar {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 120px;
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
