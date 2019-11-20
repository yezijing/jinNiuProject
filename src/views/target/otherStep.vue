<template>
  <div class="fillstep">
    <el-button class="btn backbtn" type="primary" size="small" @click="goback">返回</el-button>
    <el-steps :active="active" align-center>
      <el-step title="信息填报"></el-step>
      <el-step title="生成报表"></el-step>
    </el-steps>
    <div class="write-report" v-if="writeShow">
      <div class="names">
        <p>{{choosename}}</p>
        <p class="date">（填报月份：{{yearmonth}}）</p>
      </div>
      <!-- 列表 -->
      <el-row>
        <el-table
          class="tableinfo"
          border
          :height="stepHeight"
          :data="fillDatas"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="deptcategory" label="类别"></el-table-column>
          <el-table-column prop="deptName" label="单位" v-if="iseditshow"></el-table-column>
          <el-table-column prop="name" label="单位" v-if="isaddshow"></el-table-column>
          <el-table-column prop="cytarget" :label="label">
            <template scope="scope">
              <el-input
                v-model="scope.row.cytarget"
                size="small"
                @keyup.native="ruleone(scope.row,scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="完成总量">
            <template scope="scope">
              <el-input
                size="small"
                v-model="scope.row.amount"
                @keyup.native="ruletwo(scope.row,scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amplify" label="增幅(%)" v-if="isCrease">
            <template scope="scope">
              <el-input
                size="small"
                v-model="scope.row.amplify"
                @keyup.native="rulethree(scope.row,scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="fschedule" label="完成进度（%）" v-if="amountShow">
            <template scope="scope">
              <p>{{scope.row.fschedule}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="overtarget" label="超目标百分点（%）" v-if="isCrease">
            <template scope="scope">
              <p>{{scope.row.overtarget}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="isfinish" label="是否完成任务计划">
            <template slot-scope="scope">
              <p v-html="isOverPlan(scope,scope.row.isfinish)"></p>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div class="bottombtn">
        <el-button class="btn" size="small" type="warning" @click="goBack">取 消</el-button>
        <el-button class="btn" size="small" type="primary" @click="creatTable()">生成报表</el-button>
      </div>
    </div>
    <!-- 生成报表 -->
    <div class="report-preview" v-if="previewShow">
      <el-table
        class="tableinfo"
        border
        :data="preDatas"
        :height="creHeight"
        highlight-current-row
        style="width: 100%;"
        :span-method="typeSpanMethod"
      >
        <el-table-column :label="choosename">
          <el-table-column prop="deptcategory" label="类别"></el-table-column>
          <el-table-column prop="fscrank" label="进度排名"></el-table-column>
          <el-table-column prop="amountrank" label="总量排名"></el-table-column>
          <el-table-column prop="deptName" label="单位"></el-table-column>
          <el-table-column prop="cytarget" :label="monthname"></el-table-column>
          <el-table-column :label="titlename">
            <el-table-column label="完成总量" prop="amount"></el-table-column>
            <el-table-column label="完成进度" prop="fschedule" v-if="isJuedui">
              <template scope="scope">
                <p v-if="scope.row.fschedule>=0">{{scope.row.fschedule}}%</p>
                <p v-else style="color:#f00;">{{scope.row.fschedule}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="增幅（%）" prop="amplify" v-if="isZengfu"></el-table-column>
            <el-table-column label="超目标百分点（%）" prop="overtarget" v-if="isZengfu">
              <template scope="scope">
                <p v-if="scope.row.overtarget>=0">{{scope.row.overtarget}}%</p>
                <p v-else style="color:#f00;">{{scope.row.overtarget}}%</p>
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
      <div class="bottombtn">
        <el-button class="btn" type="primary" size="small" @click="preStep">上一步</el-button>
        <el-button class="btn" type="primary" size="small" @click="submitReport()">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addStreetdata,
  editStreetdata,
  delContrastList,
  updateStreetdata
} from "../../api/targetApi2";
export default {
  name: "fillIn",
  props: [
    "choosename",
    "yearmonth",
    "indexType",
    "fillDatas",
    "eid",
    "isEdit",
    "stepHeight",
    "creHeight",
    "listAddNum",
    "iseditshow",
    "isaddshow"
  ],
  components: {},
  data() {
    return {
      loginid: JSON.parse(this.$store.getters.userdata).id,
      active: 1,
      amountShow: false, //绝对量
      isCrease: false, //增幅
      label: "", //市下达全年目标
      writeShow: true, //填写数据
      previewShow: false, //生成报表展示
      preDatas: [], //生成报表数据
      monthname: "",
      titlename: "",
      spanArr: [],
      spanPos: 0,
      isDel: 0,
      isJuedui: false,
      isZengfu: false
    };
  },
  mounted() {},
  created() {
    if (this.indexType == 1) {
      // 增幅
      this.isCrease = true;
      this.amountShow = false;
      this.label = "目标（%）";
    } else {
      // 绝对量
      this.amountShow = true;
      this.isCrease = false;
      this.label = "目标";
    }
  },
  methods: {
    isOverPlan(scope, value) {
      switch (value) {
        case 0:
          return "<span>是</span>";
          break;
        case 1:
          return "<span style='color:#f00;'>否</span>";
          break;
      }
    },
    // 市下达全年目标数据验证
    ruleone(row, index) {
      if (this.indexType == 1) {
        // 超目标百分比
        var add = this.fillDatas[index].amplify;
        var sum = this.fillDatas[index].cytarget;
        // this.fillDatas[index].overtarget = parseFloat(add) - parseFloat(sum);
        var onum = parseFloat(add) - parseFloat(sum);
        onum = onum.toFixed(2);
        this.fillDatas[index].overtarget = onum;
        if (row.overtarget >= 0) {
          this.fillDatas[index].isfinish = 0;
        } else {
          this.fillDatas[index].isfinish = 1;
        }
      } else {
        // 完成进度
        var rr = parseFloat(row.amount) / parseFloat(row.cytarget);
        rr = rr.toFixed(3);
        var rr2 = rr * 100;
        rr2 = rr2.toFixed(2);
        this.fillDatas[index].fschedule = rr2;
        var num = this.fillDatas[index].fschedule * 100;
        if (num >= 100) {
          this.fillDatas[index].isfinish = 0;
        } else {
          this.fillDatas[index].isfinish = 1;
        }
      }
    },
    // 绝对量数据验证，数据计算
    ruletwo(row, index) {
      // 完成进度计算
      if (this.indexType == 0) {
        var rr = parseFloat(row.amount) / parseFloat(row.cytarget);
        rr = rr.toFixed(3);
        var rr2 = rr * 100;
        rr2 = rr2.toFixed(2);
        this.fillDatas[index].fschedule = rr2;
        var num = this.fillDatas[index].fschedule * 100;
        if (num >= 100) {
          this.fillDatas[index].isfinish = 0;
        } else {
          this.fillDatas[index].isfinish = 1;
        }
      } else {
        this.fillDatas[index].fschedule = 0;
      }
    },
    // 增幅验证
    rulethree(row, index) {
      // 超目标百分百计算
      var add = this.fillDatas[index].amplify;
      var sum = this.fillDatas[index].cytarget;
      // this.fillDatas[index].overtarget = parseFloat(add) - parseFloat(sum);
      var onum = parseFloat(add) - parseFloat(sum);
      onum = onum.toFixed(2);
      this.fillDatas[index].overtarget = onum;
      if (this.fillDatas[index].overtarget >= 0) {
        this.fillDatas[index].isfinish = 0;
      } else {
        this.fillDatas[index].isfinish = 1;
      }
    },
    // 取消
    goBack() {
      this.$emit("my-event");
    },
    // 生成报表
    creatTable() {
      if (this.indexType == 1) {
        this.isJuedui = true;
        this.isZengfu = true;
      } else {
        this.isJuedui = true;
        this.isZengfu = false;
      }
      this.previewShow = true;
      this.writeShow = false;
      if (this.isEdit == 1) {
        let para = {
          targetStreetReportList: this.fillDatas,
          reportUser: this.loginid
        };
        para.addnum = this.fillDatas[0].addnum;
        para = JSON.stringify(para);
        updateStreetdata(para, data => {
          this.preDatas = data.data.obj;
          this.merage();
          this.active = 2;
          this.monthname = this.yearmonth + "任务计划";
          this.titlename = this.yearmonth + "完成情况";
          this.isDel = 1;
        });
      } else {
        let para = {
          targetStreetReportList: this.fillDatas,
          reportUser: this.loginid
        };
        para = JSON.stringify(para);
        addStreetdata(para, data => {
          this.preDatas = data.data.obj;
          this.merage();
          this.active = 2;
          // this.previewShow = true;
          // this.writeShow = false;
          this.monthname = this.yearmonth + "任务计划";
          this.titlename = this.yearmonth + "完成情况";
          this.isDel = 1;
        });
      }
    },
    // 上一步
    preStep() {
      delContrastList("", data => {
        this.active = 1;
        this.previewShow = false;
        this.writeShow = true;
        this.isDel = 0;
      });
    },
    // 返回
    goback() {
      if (this.isDel == 1) {
        delContrastList("", data => {
          this.$emit("my-event");
          this.previewShow = false;
          this.writeShow = true;
        });
      } else {
        this.$emit("my-event");
        this.previewShow = false;
        this.writeShow = true;
      }
    },
    // 提交
    submitReport() {
      this.previewShow = false;
      this.writeShow = true;
      let pas = {
        targetStreetReportList: this.preDatas,
        addnum: this.listAddNum,
        userId: this.loginid
      };
      editStreetdata(pas, data => {
        this.$emit("my-event");
        this.$emit("load-event");
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
    },
    merageInit() {
      this.spanArr = [];
      this.spanPos = 0;
    },
    merage() {
      this.merageInit();
      for (let i = 0; i < this.preDatas.length; i += 1) {
        // 第1列
        if (i === 0) {
          this.spanArr.push(1);
          this.spanPos = 0;
        } else {
          if (
            this.preDatas[i].deptcategory === this.preDatas[i - 1].deptcategory
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
    // 生成报表合并单元格
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
    }
  }
};
</script>

<style lang="scss">
.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid #ccc;
}
.el-table th > .cell {
  word-break: break-word;
}
.fillstep {
  position: relative;
  .backbtn {
    position: absolute;
    left: 0;
    top: 20px;
    z-index: 9;
  }
  .names {
    display: flex;
    color: #000;
    font-size: 18px;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 20px;
    .date {
      font-size: 14px;
    }
  }
  .el-steps {
    padding: 20px 0;
  }
  .bottombtn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    .btn {
      margin-left: 20px;
    }
  }
  .tableinfo {
    .cell {
      padding: 0 10px;
      .el-input__inner {
        text-align: center;
      }
      .ts {
        color: #f00;
        font-size: 12px;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 30px;
      }
    }
  }
  .report-preview {
    .title {
      font-size: 18px;
      color: #000;
      text-align: center;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 14px;
      text-align: center;
      margin-bottom: 30px;
      color: #000;
    }
  }
}
</style>
