<template>
  <div class="content-wrap target">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="重点经济指标" name="first">
        <key-target @my-event="switchTabs" v-bind:indexNames="indexNames" v-bind:leaderList="leaderList"></key-target>
      </el-tab-pane>
      <el-tab-pane label="对比表" name="second">
        <contrast-data v-bind:indexName="indexName" v-bind:indexNames="indexNames"></contrast-data>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import keyTarget from "./keyTarget";
import contrastData from "./contrastData";
import { leaderList } from "../../api/api";
import { allIndexlist } from "../../api/targetApi";
export default {
  name: "target",
  components: {
    keyTarget,
    contrastData
  },
  data() {
    return {
      activeName: "first",
      leaderList: [],
      indexName:"",
      indexNames:[],
    };
  },
  mounted() {
    this.getLeaderList();
  },
  created() {
    this.getIndexData();
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab.name);
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
        console.log(this.indexNames);
      });
    },
  }
};
</script>

<style lang="scss">

</style>
