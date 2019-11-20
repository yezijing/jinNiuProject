<template>
  <div class="target">
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters" ref="filters" size="small">
          <el-form-item label="分管区领导：" prop="leaderId" class="ww1">
            <el-select v-model="filters.leaderId" clearable placeholder="全部">
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
            <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        class="tableinfo"
        border
        :height="tableHeight"
        :data="dutyDatas"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" :formatter="formatter"></el-table-column>
        <el-table-column prop="itemsname" label="考评项目"></el-table-column>
        <el-table-column prop="contents" label="指标内容"></el-table-column>
        <el-table-column prop="leadernames" label="分管区领导">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.leadernames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="deptnames" label="牵头单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.deptnames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="chengdeptnames" label="承办单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.chengdeptnames" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="dutys" label="工作职责"></el-table-column>
        <el-table-column prop="shideptid" label="市级牵头单位"></el-table-column>
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
  </div>
</template>

<script>
import { leaderList } from "../../api/api";
import { getmicList } from "../../api/targetApi";
export default {
  name: "dutySummary",
  props:["dutyDatas","pageSize","currentPage","totals"],
  components: {},
  data() {
    return {
      filters: {},
      // 表格数据
      tableData: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      loginid: JSON.parse(this.$store.getters.userdata).id,
      isDownShow: false,
      leaderList: [],
      tableHeight:"450px"
    };
  },
  mounted() {},
  created() {
    this.browerHeight();
    this.limitChange();
    this.getLeaderList();
  },
  methods: {
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 380;
      this.tableHeight = hh + "px";
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderList = data.data.obj;
      });
    },
    limitChange: function() {
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
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    getAllaim() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage, userid:this.loginid };
      getmicList(para, data => {
        this.dutyDatas = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 分页点击
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAllHonor();
    },
    // 分页点击
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAllHonor();
    },

    // 搜索
    getDatas: function() {
      let para = this.filters;
      para.pageSize = this.pageSize;
      para.pageNum = this.currentPage;   
      para.userid = this.loginid;
      getmicList(para, data => {
        this.dutyDatas = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getAllaim();
    },
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
</style>
