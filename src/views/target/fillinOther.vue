<template>
  <div class="target keyrank">
    <div class="mainfill" v-if="isShow">
      <!--工具条-->
      <el-row>
        <el-col :span="24" class="toolbar">
          <el-form :inline="true" :model="filters" ref="filters" size="small">
            <el-form-item label="指标名称：" prop="economicId" class="mc">
              <el-select
                v-model="filters.economicId"
                placeholder="全部"
                filterable
                clearable
                @change="selectChange"
              >
                <el-option
                  v-for="item in chengNames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="填报时间：" prop="startDate">
              <el-date-picker
                v-model="filters.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                @change="selectChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="--" prop="endDate">
              <el-date-picker
                v-model="filters.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
                @change="selectChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="牵头区领导" prop="headLeaderId" class="ld">
              <el-select
                v-model="filters.headLeaderId"
                placeholder="全部"
                filterable
                clearable
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
            <div class="toolbtns">
              <div>
                <el-button size="small" type="primary" @click="handleAdd" v-if="isAddShow">新 增</el-button>
              </div>
              <el-form-item>
                <el-button size="small" @click="getDatas('filters')" type="primary">搜 索</el-button>
                <el-button size="small" @click="resetForm('filters')">重 置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-table
          class="tableinfo"
          border
          :height="tableHeight"
          :data="tableDatas"
          highlight-current-row
          :row-class-name="tableRowClassName"
          style="width: 100%;"
        >
          <el-table-column label="序号" width="60" :formatter="formatter"></el-table-column>
          <el-table-column prop="reportDate" :formatter="timestampToTime" label="填报时间">
            <template slot-scope="scope">
              <span>{{scope.row.reportDate | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="economicName" label="指标名称"></el-table-column>
          <el-table-column prop="month" label="填报月份"></el-table-column>
          <el-table-column prop="leadName" label="牵头区领导"></el-table-column>
          <el-table-column prop="deptnames" label="牵头单位"></el-table-column>
          <el-table-column prop="economicType" label="指标类型">
            <template slot-scope="scope">
              <span v-html="statusFormat(scope,scope.row.economicType)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column
            prop="audit"
            label="状态"
            :filters="[{ text: '审核未通过', value: 2 }, { text: '审核通过', value: 1 }, { text: '未审核', value: 0 }, { text: '未上报', value: -1 }]"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.audit == 2" type="danger" disable-transitions>
                <span v-html="swstateFormat(scope,scope.row.audit)"></span>
              </el-tag>
              <el-tag v-else-if="scope.row.audit == 1" type="success" disable-transitions>
                <span v-html="swstateFormat(scope,scope.row.audit)"></span>
              </el-tag>
              <el-tag v-else type="info" disable-transitions>
                <span v-html="swstateFormat(scope,scope.row.audit)"></span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template scope="scope">
              <el-button
                class="btn nobtn"
                @click="handleEdit(scope.$index, scope.row)"
                v-if="isEditShow"
              >编辑</el-button>
              <el-button class="btn" @click="handleDetail(scope.$index, scope.row)">查看报表</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 40]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, sizes, jumper"
          :total="totals"
        ></el-pagination>
      </el-row>
      <!-- 新增 -->
      <el-dialog class="fillbox" title="新增承办单位经济指标填报" :visible.sync="stepFormVisible" width="500px">
        <el-form :model="stepForm" label-width="100px" ref="stepForm" size="small">
          <el-form-item
            label="指标名称："
            prop="indexid"
            :rules="[{ required: true, message: '请先选择指标名称',trigger:'change'}]"
          >
            <el-select
              v-model="stepForm.indexid"
              placeholder="请选择"
              filterable
              clearable
              @change="selectChange()"
            >
              <el-option
                v-for="item in chengNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="ylist">
            <el-form-item label="填报月份：" prop="startDate" class="ybox">
              <el-select
                v-model="stepForm.startDate"
                placeholder="开始月份"
                filterable
                clearable
                @change="selectChange()"
              >
                <el-option
                  v-for="item in months"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="--" prop="endDate" class="endbox">
              <el-select
                v-model="stepForm.endDate"
                placeholder="结束月份"
                filterable
                clearable
                @change="selectChange()"
              >
                <el-option
                  v-for="item in months"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="nextStep('stepForm')">下一步</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 下一步 -->
    <div class="nextstep" v-if="stepShow">
      <other-step
        @my-event="handleBack"
        @load-event="getAllDatas"
        v-bind:fillDatas="fillDatas"
        v-bind:indexType="indexType"
        v-bind:yearmonth="yearmonth"
        v-bind:choosename="choosename"
        v-bind:eid="eid"
        v-bind:isEdit="isEdit"
        v-bind:stepHeight="stepHeight"
        v-bind:creHeight="creHeight"
        v-bind:listAddNum="listAddNum"
        v-bind:iseditshow="iseditshow"
        v-bind:isaddshow="isaddshow"
      ></other-step>
    </div>
    <!-- 查看报表 -->
    <div class="viewreport" v-if="viewReport">
      <div class="bottombtn">
        <el-button class="btn" size="small" type="primary" @click="goBack">返回</el-button>
        <el-button class="btn" size="small" type="primary" @click="downReportData" v-if="isDownShow">报表下载</el-button>
      </div>
      <el-table
        class="tableinfo"
        border
        :height="lookHeight"
        :data="viewDatas"
        highlight-current-row
        style="width: 100%;"
        :span-method="typeSpanMethod"
      >
        <el-table-column :label="choosename">
          <el-table-column prop="deptcategory" label="类别"></el-table-column>
          <el-table-column prop="fscrank" label="进度排名"></el-table-column>
          <el-table-column prop="amountrank" label="总量排名"></el-table-column>
          <el-table-column prop="deptName" label="单位"></el-table-column>
          <el-table-column prop="cytarget" label="任务计划"></el-table-column>
          <el-table-column label="完成情况">
            <el-table-column label="完成总量" prop="amount">
              <template slot-scope="scope">
                <p v-html="amountFormat(scope,scope.row.amount)"></p>
              </template>
            </el-table-column>
            <el-table-column label="完成进度" prop="fschedule" v-if="isJuedui">
              <template slot-scope="scope">
                <p v-html="fscheduleFormat(scope,scope.row.fschedule)"></p>
              </template>
            </el-table-column>
            <el-table-column label="增幅" prop="amplify">
              <template slot-scope="scope">
                <p v-html="amplifyFormat(scope,scope.row.amplify)"></p>
              </template>
            </el-table-column>
            <el-table-column label="超目标百分点" prop="overtarget">
              <template slot-scope="scope">
                <p v-html="overtargetFormat(scope,scope.row.overtarget)"></p>
              </template>
            </el-table-column>
            <el-table-column label="是否完成任务计划" prop="isfinish">
              <template slot-scope="scope">
                <p v-if="scope.row.isfinish==0">是</p>
                <p v-else-if="scope.row.isfinish==1" style="color:#f00;">否</p>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  keyRank,
  getContrastList,
  fillstreetList,
  getreportList,
  detailStreetdata,
  otherViewReport
} from "../../api/targetApi2";
import otherStep from "./otherStep";
import nameBus from "@/components/nameBus.js";
import { defaturl } from "../../api/apiUrl";
export default {
  name: "fillIn",
  props: ["leaderList", "chengNames"],
  components: {
    otherStep
  },
  data() {
    return {
      loginid: JSON.parse(this.$store.getters.userdata).id,
      filters: {},
      currentPage: 1, //当前页
      pageSize: 20, //一页展示条数
      totals: 0, //总条数
      // 表格数据
      tableDatas: [],
      indexName: "", //指标列表
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isAddShow: false,
      isEditShow: false,
      isDownShow: false,
      viewReport: false,
      stepForm: {},
      stepFormVisible: false,
      isShow: true,
      // 下一步是否显示
      stepShow: false,
      yearmonth: "", //选择的填报月份
      choosename: "", //选择填报的指标名称
      indexType: 0,
      fillDatas: [],
      eid: "",
      startmonth: "",
      endmonth: "",
      viewDatas: [],
      spanArr: [],
      spanPos: 0,
      isEdit: 0,
      titlename: "",
      monthname: "",
      months: [
        {
          value: 1,
          name: "1月"
        },
        {
          value: 2,
          name: "2月"
        },
        {
          value: 3,
          name: "3月"
        },
        {
          value: 4,
          name: "4月"
        },
        {
          value: 5,
          name: "5月"
        },
        {
          value: 6,
          name: "6月"
        },
        {
          value: 7,
          name: "7月"
        },
        {
          value: 8,
          name: "8月"
        },
        {
          value: 9,
          name: "9月"
        },
        {
          value: 10,
          name: "10月"
        },
        {
          value: 11,
          name: "11月"
        },
        {
          value: 12,
          name: "12月"
        }
      ],
      tableHeight: "500px", //设置表格高度
      stepHeight: "300px",
      creHeight: "300px",
      lookHeight: "350px",
      listAddNum: -1,
      iseditshow: false,
      isaddshow: false,
      economicid:0,
      addnum:0,
      defaturl:"",
      isJuedui: false,
      isZeng: false,
    };
  },
  mounted() {},
  created() {
    this.defaturl = defaturl;
    this.browerHeight();
    this.limitChange();
    this.getAllDatas();
  },
  methods: {
    // 报表下载
    downReportData(){
        if(this.isZeng){
          window.open(this.defaturl + "/report/targetStreetAmplifyReport?economicid="+this.economicid+"&addnum="+this.addnum);
        }else{
          window.open(this.defaturl + "/report/targetStreetAmountReport?economicid="+this.economicid+"&addnum="+this.addnum);
        }
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.audit == 1) {
        return "noedit";
      }
    },

    filterTag(value, row) {
      return row.statsus === value;
    },
    // 审核状态
    swstateFormat(scope, value) {
      switch (value) {
        case 2:
          return "审核未通过";
          break;
        case 1:
          return "审核通过";
          break;
        case 0:
          return "未审核";
          break;
      }
    },
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      var hh2 = bheight - 350;
      var hh3 = bheight - 280;
      this.tableHeight = hh + "px";
      this.stepHeight = hh + "px";
      this.creHeight = hh2 + "px";
      this.lookHeight = hh2 + "px";
    },
    // 日期格式转换
    timestampToTime(row, column) {
      var date = new Date(row.reportDate);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate();
      return Y + M + D;
    },
    getAllDatas() {
      let para = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        userId: this.loginid
      };
      getreportList(para, data => {
        this.tableDatas = data.data.obj.datas;
        for (var i = 0; i < this.tableDatas.length; i++) {
          this.tableDatas[i].month =
            this.tableDatas[i].startmonth +
            "月 - " +
            this.tableDatas[i].endmonth +
            "月";
          if (this.tableDatas[i].deptnames == null) {
            this.tableDatas[i].deptnames = "";
          } else {
            this.tableDatas[i].deptnames = this.tableDatas[i].deptnames.join(
              "，"
            );
          }
        }
        this.totals = data.data.obj.total;
      });
    },
    // 分页点击
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAllDatas();
    },
    // 分页点击
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAllDatas();
    },
    statusFormat(scope, value) {
      switch (value) {
        case "1":
          return "增幅";
          break;
        case "0":
          return "绝对量";
          break;
      }
    },
    limitChange: function() {
      if (this.targetCheckList !== null) {
        for (var i = 0; i < this.targetCheckList.length; i++) {
          let value = this.targetCheckList[i];
          switch (value) {
            case "D-add":
              this.isAddShow = true;
              break;
            case "D-edit":
              this.isEditShow = true;
              break;
            case "D-down":
              this.isDownShow = true;
              break;
          }
        }
      }
    },
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    selectChange() {
      this.$forceUpdate();
    },
    // 返回
    handleBack: function() {
      this.isShow = true;
      this.stepShow = false;
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.userId = this.loginid;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;
      getreportList(para, data => {
        this.tableDatas = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllDatas();
    },
    // 新增
    handleAdd: function() {
      this.stepForm.startDate = 1;
      this.stepFormVisible = true;
    },
    selectName() {
      let id = this.stepForm.indexid;
      for (var i = 0; i < this.chengNames.length; i++) {
        if (this.chengNames[i].id == id) {
          this.choosename = this.chengNames[i].name;
          this.indexType = this.chengNames[i].type;
          break;
        }
      }
    },
    // 新增下一步
    nextStep: function() {
      this.$refs.stepForm.validate(valid => {
        if (valid) {
          let para = { economicid: this.stepForm.indexid };
          this.eid = this.stepForm.indexid;
          this.startmonth = this.stepForm.startDate;
          this.endmonth = this.stepForm.endDate;
          fillstreetList(para, data => {
            this.fillDatas = data.data.obj;
            console.log(this.fillDatas);
            for (var i = 0; i < data.data.obj.length; i++) {
              this.fillDatas[i].amount = "";
              this.fillDatas[i].amplify = "";
              this.fillDatas[i].cytarget = "";
              this.fillDatas[i].overtarget = "";
              this.fillDatas[i].fschedule = "";
              this.fillDatas[i].isfinish = "";
              this.fillDatas[i].startmonth = this.startmonth;
              this.fillDatas[i].endmonth = this.endmonth;
              this.fillDatas[i].economicid = this.stepForm.indexid;
              this.fillDatas[i].deptid = this.fillDatas[i].id;
            }
            this.selectName();
            this.yearmonth =
              this.stepForm.startDate + "月 - " + this.stepForm.endDate + "月";
            this.stepShow = true;
            this.stepFormVisible = false;
            this.isShow = false;
            this.iseditshow = false;
            this.isaddshow = true;
            this.stepForm = {};
            this.isEdit = 0;
          });
        }
      });
    },
    // 查看报表
    handleDetail: function(index, row) {
      if (row.economicType == "1") {
        this.isZeng = true;
        this.isJuedui = false;
      } else {
        this.isJuedui = true;
        this.isZeng = false;
      }
      this.economicid = row.economicId;
      this.addnum= row.addnum;
      this.choosename = row.economicName + "（" + row.month + "）";
      let para = { economicid: row.economicId, addnum: row.addnum };
      otherViewReport(para, data => {
        this.viewDatas = data.data.obj;
        this.merage();
        this.viewReport = true;
        this.isShow = false;
      });
    },
    isfinishFormat(scope, value) {
      switch (value) {
        case 0:
          return "是";
          break;
        case 1:
          return "否";
          break;
      }
    },
    fscheduleFormat(scope, value) {
      if (value == null) {
        return "<span>/</span>";
      } else {
        if (value < 0) {
          return "<span style='color:#f00;'>" + value + "</span>";
        } else {
          return "<span>" + value + "</span>";
        }
      }
    },
    amountFormat(scope, value) {
      if (value == null) {
        return "<span>/</span>";
      } else {
        if (value < 0) {
          return "<span style='color:#f00;'>" + value + "</span>";
        } else {
          return "<span>" + value + "</span>";
        }
      }
    },
    amplifyFormat(scope, value) {
      if (value == null) {
        return "<span>/</span>";
      } else {
        if (value < 0) {
          return "<span style='color:#f00;'>" + value + "%</span>";
        } else {
          return "<span>" + value + "%</span>";
        }
      }
    },
    overtargetFormat(scope, value) {
      if (value == null) {
        return "<span>/</span>";
      } else {
        if (value < 0) {
          return "<span style='color:#f00;'>" + value + "%</span>";
        } else {
          return "<span>" + value + "%</span>";
        }
      }
    },
    // 返回
    goBack: function() {
      this.viewReport = false;
      this.isShow = true;
    },
    merageInit() {
      this.spanArr = [];
      this.spanPos = 0;
    },
    merage() {
      this.merageInit();
      for (let i = 0; i < this.viewDatas.length; i += 1) {
        // 第1列
        if (i === 0) {
          this.spanArr.push(1);
          this.spanPos = 0;
        } else {
          if (
            this.viewDatas[i].deptcategory ===
            this.viewDatas[i - 1].deptcategory
          ) {
            this.spanArr[this.spanPos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.spanPos = i;
          }
        }
      }
    },
    // 合并单元格
    typeSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第1列的合并方法
        const row = this.spanArr[rowIndex];
        const col = row > 0 ? 1 : 0; // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row,
          colspan: col
        };
      }
    },
    // 编辑
    handleEdit: function(index, row) {
      this.listAddNum = row.addnum;
      this.choosename = row.economicName;
      let para = { economicid: row.economicId, addnum: row.addnum };
      this.indexType = row.economicType;
      detailStreetdata(para, data => {
        let datas = data.data.obj;
        this.fillDatas = data.data.obj;
        this.yearmonth =
          datas[0].startmonth + "月 - " + datas[0].endmonth + "月";
        this.stepShow = true;
        this.isShow = false;
        this.isEdit = 1;
        this.iseditshow = true;
        this.isaddshow = false;
      });
    }
  }
};
</script>

<style lang="scss">
.toolbar {
  .ww1 {
    .el-select {
      width: 140px;
    }
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
      width: 140px;
    }
    .el-form--inline .ybox {
      margin-right: 5px;
    }
  }
  .fillbox {
    .ylist {
      display: flex;
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 120px;
      }
      .endbox {
        .el-form-item__label {
          width: auto !important;
          padding-left: 12px;
        }
        .el-form-item__content {
          margin-left: 40px !important;
        }
      }
    }
    .el-select {
      display: block;
    }
  }
}
</style>
