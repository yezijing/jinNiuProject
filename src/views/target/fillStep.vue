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
        <p class="date">（{{yearmonth}}）</p>
      </div>
      <!-- 列表 -->
      <el-row>
        <el-table
          class="tableinfo"
          border
          :data="fillDatas"
          highlight-current-row
          :height="stepHeight"
          style="width: 100%;"
        >
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="typeName" label="类别"></el-table-column>
          <el-table-column prop="districtName" label="区（市）县"></el-table-column>
          <el-table-column prop="cytarget" :label="label">
            <template scope="scope">
              <el-input
                v-model="scope.row.cytarget"
                @change.native="ruleone(scope.row,scope.$index)"
                size="small"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="绝对量">
            <template scope="scope">
              <el-input
                size="small"
                v-model="scope.row.amount"
                @change.native="ruletwo(scope.row,scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amplify" label="增幅(%)" v-if="isCrease">
            <template scope="scope">
              <el-input
                v-model="scope.row.amplify"
                size="small"
                @change.native="rulethree(scope.row,scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="fschedule" label="完成进度（%）" v-if="amountShow">
            <template scope="scope">
              <p>{{scope.row.fschedule}}%</p>
            </template>
          </el-table-column>
          <el-table-column prop="overtarget" label="超目标百分点(%)" v-if="isCrease">
            <template scope="scope">
              <p>{{scope.row.overtarget}}%</p>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div class="bottombtn">
        <el-button class="btn" type="warning" size="small" @click="goBack">取 消</el-button>
        <el-button class="btn" type="primary" size="small" @click="creatTable()">生成报表</el-button>
      </div>
    </div>
    <!-- 生成报表 -->
    <div class="report-preview" v-if="previewShow">
      <el-table
        class="tableinfo"
        border
        :data="preDatas"
        highlight-current-row
        style="width: 100%;"
        :height="creHeight"
      >
        <el-table-column :label="tname">
          <el-table-column prop="districtName" label="区（市）县"></el-table-column>
          <el-table-column prop="cytarget" label="目标"></el-table-column>
          <el-table-column label="目标完成额">
            <el-table-column label="绝对量" prop="amount"></el-table-column>
            <el-table-column label="五城区排名" prop="amountfiverank"></el-table-column>
            <el-table-column label="中心城区排名" prop="amountcentralrank"></el-table-column>
            <el-table-column label="全市排名" prop="amountcityrank"></el-table-column>
            <el-table-column label="增幅" prop="amplify" v-if="isnumShow"></el-table-column>
            <el-table-column label="五城区排名" prop="amplifyfiverank" v-if="isnumShow"></el-table-column>
            <el-table-column label="中心城区排名" prop="amplifycentralrank" v-if="isnumShow"></el-table-column>
            <el-table-column label="全市排名" prop="amplifycityrank" v-if="isnumShow"></el-table-column>
          </el-table-column>
          <el-table-column label="目标完成率">
            <el-table-column label="完成进度" prop="fschedule" v-if="isjinShow">
              <template scope="scope">
                <p v-if="scope.row.fschedule>=0">{{scope.row.fschedule}}%</p>
                <p v-else style="color:#f00;">{{scope.row.fschedule}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="五城区排名" prop="fschedulefiverank" v-if="isjinShow"></el-table-column>
            <el-table-column label="中心城区排名" prop="fschedulecentralrank" v-if="isjinShow"></el-table-column>
            <el-table-column label="全市排名" prop="fschedulecityrank" v-if="isjinShow"></el-table-column>
            <el-table-column label="超目标百分点" prop="overtarget" v-if="isnumShow">
              <template scope="scope">
                <p v-if="scope.row.overtarget>=0">{{scope.row.overtarget}}%</p>
                <p v-else style="color:#f00;">{{scope.row.overtarget}}%</p>
              </template>
            </el-table-column>
            <el-table-column label="五城区排名" prop="overtargetfiverank" v-if="isnumShow"></el-table-column>
            <el-table-column label="中心城区排名" prop="overtargetcentralrank" v-if="isnumShow"></el-table-column>
            <el-table-column label="全市排名" prop="overtargetcityrank" v-if="isnumShow"></el-table-column>
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
  addAreaList,
  editAreadata,
  delAreaList,
  updateAreadata
} from "../../api/targetApi2";
export default {
  name: "fillIn",
  props: [
    "choosename",
    "yearmonth",
    "indexType",
    "fillDatas",
    "isEdit",
    "stepHeight",
    "creHeight",
    "listAddNum"
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
      tname: "",
      isDel: 0,
      isnumShow: false,
      isjinShow: false
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
    // 市下达全年目标数据验证
    ruleone(row, index) {
      if (this.indexType == 1) {
        // 超目标百分比
        var add = this.fillDatas[index].amplify;
        var sum = this.fillDatas[index].cytarget;
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
        rr = rr.toFixed(4);
        var rr2 = rr * 100;
        rr2 = rr2.toFixed(2);
        this.fillDatas[index].fschedule = rr2 * 100;
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
        rr = rr.toFixed(4);
        var rr2 = rr * 100;
        rr2 = rr2.toFixed(2)
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
      this.previewShow = true;
      this.writeShow = false;
      if (this.indexType == 1) {
        this.isnumShow = true;
        this.isjinShow = false;
      } else {
        this.isnumShow = false;
        this.isjinShow = true;
      }
      if (this.isEdit == 1) {
        let para = { targetOtherEconomicList: this.fillDatas, reportUser: this.loginid, };
        para.addnum = this.fillDatas[0].addnum;
        para = JSON.stringify(para);
        updateAreadata(para, data => {
          this.preDatas = data.data.obj;
          this.tname = this.choosename + "（" + this.yearmonth + "）";
          this.active = 2;
          // this.previewShow = true;
          // this.writeShow = false;
          this.isDel = 1;
        });
      } else {
        let para = { targetOtherEconomicList: this.fillDatas, reportUser: this.loginid, };
        para = JSON.stringify(para);
        addAreaList(para, data => {
          this.preDatas = data.data.obj;
          this.tname = this.choosename + "（" + this.yearmonth + "）";
          this.active = 2;
          this.isDel = 1;
        });
      }
    },
    // 上一步
    preStep() {
      delAreaList("", data => {
        this.previewShow = false;
        this.writeShow = true;
        this.active = 1;
        this.isDel = 0;
      });
    },
    // 返回
    goback() {
      if (this.isDel == 1) {
        delAreaList("", data => {
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
      // if (this.isEdit == 1) {
      //   let para = { addnum: this.preDatas[0].addnum };
      //   delAreaList(para, data => {
      //     let pas = { targetOtherEconomicList: this.preDatas };
      //     editAreadata(pas, data => {
      //       this.$emit("my-event");
      //       this.previewShow = false;
      //       this.writeShow = true;
      //       this.$message({
      //         message: "提交成功",
      //         type: "success"
      //       });
      //     });
      //   });
      // } else {

      // }
      this.previewShow = false;
      this.writeShow = true;
      let para = {
        targetOtherEconomicList: this.preDatas,
        userId: this.loginid,
        addnum: this.listAddNum
      };
      editAreadata(para, data => {
        this.$emit("my-event");
        this.$emit("load-event");
        this.$message({
          message: "提交成功",
          type: "success"
        });
      });
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
