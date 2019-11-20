<template>
  <div class="target otherfill">
    <p class="navtitle">
      <span>其他区县填报</span>
    </p>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters">
          <el-form-item label="区（市）县：" prop="name" class="ww2">
            <el-input v-model="filters.name" placeholder="请输入" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="时间：" prop="startyear" class="ybox">
            <el-date-picker
              v-model="filters.startyear"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="--" prop="endyear">
            <el-date-picker
              v-model="filters.endyear"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="指标名称" prop="economicid" class="ww2">
            <el-select v-model="filters.economicid" placeholder="请选择" filterable clearable>
              <el-option
                v-for="item in indexNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="toolbtns">
            <el-button type="primary" @click="handleAdd" v-if="isAddShow">新 增</el-button>
            <el-form-item>
              <el-button @click="getDatas('filters')" type="primary">搜 索</el-button>
              <el-button @click="resetForm('filters')">重 置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        class="tableinfo"
        border
        :data="assignDatas"
        highlight-current-row
        style="width: 100%;"
      >
        <!-- <el-table-column prop="years" label="时间" width="180"></el-table-column> -->
        <el-table-column label="时间段">
          <el-table-column prop="startyear" label="开始时间" :formatter="timestampToTime" width="100"></el-table-column>
          <el-table-column prop="endyear" label="结束时间" :formatter="timestampToTime2" width="100"></el-table-column>
        </el-table-column>
        <el-table-column prop="name" label="区（市）县"></el-table-column>
        <el-table-column prop="ename" label="指标名称"></el-table-column>
        <el-table-column label="目标完成额">
          <el-table-column prop="amount" label="绝对量"></el-table-column>
          <el-table-column prop="amplify" label="增幅"></el-table-column>
        </el-table-column>
        <el-table-column label="目标完成率">
          <el-table-column prop="finishschedule" label="完成进度"></el-table-column>
          <el-table-column prop="overtarget" label="超目标百分点"></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 50]"
        :page-size="pageSize"
        layout="prev, pager, next, total, sizes, jumper"
        :total="totals"
      ></el-pagination>
    </el-row>

    <!-- 新增 -->
    <el-dialog class="managebox" title="新增" :visible.sync="addFormVisible" width="760px">
      <el-form :inline="true" :model="addForm" label-width="140px" ref="addForm">
        <p class="mtitle">基本信息</p>
        <el-form-item label="区（市）县：" prop="name" :rules="[{ required: true, message: '请选择区（市）县'}]">
          <el-select v-model="addForm.name" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in areaNames"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="指标名称："
          prop="economicid"
          :rules="[{ required: true, message: '请选择指标'}]"
        >
          <el-select v-model="addForm.economicid" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in indexNames"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：" prop="startyear" :rules="[{ required: true, message: '请选择'}]">
          <el-date-picker
            v-model="addForm.startyear"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endyear" :rules="[{ required: true, message: '请选择'}]">
          <el-date-picker
            v-model="addForm.endyear"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <p class="mtitle">目标完成额</p>
        <el-form-item label="绝对量：" prop="amount">
          <el-input v-model="addForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="增幅：" prop="amplify">
          <el-input v-model="addForm.amplify"></el-input>
        </el-form-item>
        <p class="mtitle">目标完成率</p>
        <el-form-item label="完成进度：" prop="finishschedule">
          <el-input v-model="addForm.finishschedule" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="超目标百分点：" prop="overtarget">
          <el-input placeholder="请输入" v-model="addForm.overtarget"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit('addForm')">新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  allArealist,
  allIndexlist,
  addOtherfill,
  getAllOtherfill,
  getFilterOtherfill
} from "../../api/targetApi";
export default {
  name: "streetRank",
  components: {},
  data() {
    return {
      addFormVisible: false,
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      filters: {},
      areaNames: [],
      indexNames: [],
      addForm: {},
      assignDatas: [],
      cyear: "",
      cyear2: "",
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isAddShow: false
    };
  },
  mounted() {},
  created() {
    if (this.targetCheckList !== null) {
      for (var i = 0; i < this.targetCheckList.length; i++) {
        let value = this.targetCheckList[i];
        switch (value) {
          case "D-add":
            this.isAddShow = true;
            break;
        }
      }
    }
    this.getOtherAll();
    this.getIndexData();
  },
  methods: {
    // 其他区县列表
    getOtherAll() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage };
      getFilterOtherfill(para, data => {
        this.assignDatas = data.data.obj.datas;
        console.log(data.data.obj);
        this.totals = data.data.obj.totals;
        // let y1 = "";
        // let y2 = "";
        // for(var i=0;i<this.assignDatas.length;i++){
        //   y1 = new Date(this.assignDatas[i].startyear);
        //   y2 = new Date(this.assignDatas[i].endyear);
        //   this.dateChange(y1);
        //   this.dateChange2(y2);
        //   this.assignDatas[i].years = this.cyear+" -- "+this.cyear2;
        // }
      });
    },
    timestampToTime(row, column) {
      var date = new Date(row.startyear); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var D = date.getDate() + " ";
      return Y + M;
    },
    timestampToTime2(row, column) {
      var date = new Date(row.endyear); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var D = date.getDate() + " ";
      return Y + M;
    },

    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getOtherAll();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getOtherAll();
    },
    dateChange(date) {
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      this.cyear = Y + M;
    },
    dateChange2(date) {
      var Y = date.getFullYear() + "-";
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      this.cyear2 = Y + M;
    },
    // 获取区市县数据列表
    getAreaData() {
      allArealist("", data => {
        console.log(data.data.obj);
        this.areaNames = data.data.obj;
      });
    },
    // 经济指标列表
    getIndexData() {
      allIndexlist("", data => {
        console.log(data.data.obj);
        this.indexNames = data.data.obj;
      });
    },
    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.pageNum = this.currentPage;
      para.pageSize = this.pageSize;
      getFilterOtherfill(para, data => {
        this.assignDatas = data.data.obj.datas;
        console.log(data.data.obj);
        this.totals = data.data.obj.totals;
        let y1 = "";
        let y2 = "";
        for (var i = 0; i < this.assignDatas.length; i++) {
          y1 = new Date(this.assignDatas[i].startyear);
          y2 = new Date(this.assignDatas[i].endyear);
          this.dateChange(y1);
          this.dateChange2(y2);
          this.assignDatas[i].years = this.cyear + " -- " + this.cyear2;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getOtherAll();
    },
    // 新增
    handleAdd() {
      this.getAreaData();
      this.addFormVisible = true;
    },
    // 新增提交
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let para = Object.assign({}, this.addForm);
          para.isjnq = 1;
          addOtherfill(
            para,
            res => {
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getOtherAll();
            },
            () => {
              this.$message({
                message: "新增失败",
                type: "error"
              });
            }
          );
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
}
.managebox {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 200px;
  }
  .mtitle {
    font-weight: bold;
    color: #222;
    font-size: 16px;
    margin-bottom: 20px;
    padding-left: 30px;
  }
  .detail-check {
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #222;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #409eff;
      border-color: #409eff;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background: #fff;
    }
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    color: #fff;
  }
  .el-input__inner {
    width: 200px;
  }
  .yearbox {
    position: relative;
    width: 350px;
    margin-right: 10px;
    display: inline-block;
    .jiabtn {
      height: 36px;
      line-height: 36px;
      position: absolute;
      right: 0;
      top: 0;
      .icon {
        color: #666;
        font-size: 24px;
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        cursor: pointer;
      }
      .awrap {
        position: absolute;
        left: 44px;
        top: 0;
        border: 1px solid #ccc;
        background: #fff;
        width: 250px;
        padding: 5px 10px 10px;
        z-index: 99;
        p {
          color: #666;
        }
        .el-textarea {
          width: 100%;
          margin-bottom: 10px;
        }
        .buttons {
          display: flex;
          justify-content: center;
          .el-button {
            padding: 8px 18px;
          }
        }
      }
    }
  }
}
.otherfill {
  .toolbar {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 150px;
    }
    .el-form--inline .ybox {
      margin-right: 5px;
    }
  }
}
</style>
