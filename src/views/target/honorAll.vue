<template>
  <div class="content-wrap honor-all">
    <p class="navtitle">
      <span>表彰奖牌情况汇总表</span>
    </p>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button type="primary" size="small" v-if="isDownShow">报表下载</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row>
      <el-table
        class="tableinfo"
        border
        :max-height="tableHeight"
        :data="honorData"
        highlight-current-row
        style="width: 100%;overflow:auto;"
      >
        <el-table-column label="序号" width="60" :formatter="formatter"></el-table-column>
        <el-table-column prop="awardname" label="奖项名称"></el-table-column>
        <el-table-column prop="awarddept" label="颁发单位"></el-table-column>
        <el-table-column label="获奖区（市）县">
          <el-table-column prop="fiveQu" label="五城区" width="120"></el-table-column>
          <el-table-column prop="centerQu" label="中心城区" width="120"></el-table-column>
          <el-table-column prop="otherQu" label="其他区县" width="120"></el-table-column>
        </el-table-column>
        <el-table-column prop="leaderNameList" label="牵头领导">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.leaderNameList" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="leaderDeptNameList" label="牵头单位">
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.leaderDeptNameList" :key="index">{{item}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, sizes, jumper"
      :total="totals"
    ></el-pagination>
  </div>
</template>

<script>
import { getCountAll } from "../../api/targetApi";
export default {
  name: "honorAll",
  components: {},
  data() {
    return {
      honorData: [],
      targetCheckList: JSON.parse(this.$store.getters.userdata).targetCheckList,
      isDownShow: false,
      currentPage: 1,
      pageSize: 10,
      totals: 0,
      tableHeight:"500px"
    };
  },
  mounted() {},
  created() {
    this.browerHeight();
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
    this.getAllHonor();
  },
  methods: {
    // 获取浏览器高度，计算table高度
    browerHeight() {
      var bheight = document.body.clientHeight;
      var hh = bheight - 320;
      this.tableHeight = hh + "px";
    },
    formatter(row, column, cellValue, index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize;
    },
    getAllHonor() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage };
      getCountAll(para, data => {
        console.log(data)
        this.totals = data.data.obj.total;
        this.honorData = data.data.obj.datas;
        console.log(this.honorData)
      });
    },
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getAllHonor();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      this.getAllHonor();
    }
  }
};
</script>

<style lang="scss">
</style>
