<template>
  <div class="content-wrap target">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="各区市县完成情况" name="first">
        <fillin-area v-bind:indexNames="indexNames" v-bind:leaderList="leaderList"></fillin-area>
      </el-tab-pane>
      <el-tab-pane label="各街道等承办单位完成情况" name="second">
        <fillin-other v-bind:chengNames="chengNames" v-bind:leaderList="leaderList"></fillin-other>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import fillinArea from "./fillinArea";
import fillinOther from "./fillinOther";
import { leaderList } from "../../api/api";
import { allIndexlist, getAllCheng } from "../../api/targetApi";
import { getreportList } from "../../api/targetApi2";
export default {
  name: "target",
  components: {
    fillinArea,
    fillinOther
  },
  data() {
    return {
      activeName: "first",
      loginid: JSON.parse(this.$store.getters.userdata).id,
      leaderList: [],
      indexName:"",
      indexNames:[],
      chengNames:[],
      currentPage: 1, //当前页
      pageSize: 10, //一页展示条数
      totals: 0, //总条数
      othertableDatas:[],
    };
  },
  mounted() {
    this.getLeaderList();
  },
  created() {
    this.getIndexData();
    this.getAllDatas();
    this.getChengbanData();
  },
  methods: {
    getAllDatas(){
      let para = { pageSize: this.pageSize, pageNum: this.currentPage, userId: this.loginid };
      getreportList(para,data => {
        this.othertableDatas = data.data.obj;
      })
    },
    handleTabClick(tab, event) {
      // this.getAllDatas();
    },
    switchTabs(name) {
      this.activeName = "second";
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderList = data.data.obj;
      });
    },
    // 经济指标列表
    getIndexData() {
      allIndexlist("", data => {
        this.indexNames = data.data.obj;
      });
    },
    // 承办单位指标列表
    getChengbanData(){
      getAllCheng("", data => {
        this.chengNames = data.data.obj;
      });
    }
  }
};
</script>

<style lang="scss">

</style>
