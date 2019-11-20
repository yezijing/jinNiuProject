<template>
  <div class="content-wrap target">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="区级指标管理" name="first">
        <manage-index
          v-bind:leaderList="leaderList"
          v-bind:deptList="deptList"
        ></manage-index>
      </el-tab-pane>
      <el-tab-pane label="承办单位指标管理" name="second">
        <manage-district
          v-bind:leaderList="leaderList"
          v-bind:deptList="deptList"
        ></manage-district>
      </el-tab-pane>
      <el-tab-pane label="区（市）县管理" name="third">
        <manage-area></manage-area>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import manageIndex from "./manageIndex";
import manageArea from "./manageArea";
import manageDistrict from "./manageDistrict";
import { leaderList, alldeptList } from "../../api/api";
export default {
  name: "target",
  components: { manageArea, manageIndex, manageDistrict },
  data() {
    return {
      activeName: "first",
      leaderList: [],
      deptList: [],
    };
  },
  mounted() {},
  created() {
    this.getLeaderList();
    this.getDeptlist();
  },
  methods: {
    handleTabClick(tab, event) {
      
    },
    switchTabs() {
      // this.activeName = "second";
    },
    // 获取领导列表
    getLeaderList: function() {
      leaderList("", data => {
        this.leaderList = data.data.obj;
      });
    },
    //   获取部门列表
    getDeptlist: function() {
      alldeptList("", data => {
        this.deptList = data.data.obj;
      });
    }
  }
};
</script>

<style lang="scss">
.target {
  .toolbar {
    .ww0 {
      margin-right: 40px;
      .el-input__inner {
        width: 120px;
      }
    }
  }
}
</style>
