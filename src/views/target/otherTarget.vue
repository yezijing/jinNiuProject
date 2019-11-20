<template>
  <div class="content-wrap target">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="进展汇总表" name="first">
        <other-summary></other-summary>
      </el-tab-pane>
      <el-tab-pane label="目标责任分解表" name="second">
        <duty-summary v-bind:dutyDatas="dutyDatas" v-bind:currentPage="currentPage" v-bind:pageSize="pageSize" v-bind:totals="totals"></duty-summary>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import otherSummary from "./otherSummary";
import dutySummary from "./dutySummary";
import { getmicList } from "../../api/targetApi";
export default {
  name: "target",
  components: {
    otherSummary,
    dutySummary
  },
  data() {
    return {
      activeName: "first",
      dutyDatas:[],
      loginid: JSON.parse(this.$store.getters.userdata).id,
      currentPage: 1,
      pageSize: 10,
      totals: 0,
    };
  },
  mounted() {
  },
  created() {
    this.getAllaim();
  },
  methods: {
    handleTabClick(tab, event) {
      if(tab.name == 'second'){
        this.getAllaim();
      }
    },
    getAllaim() {
      let para = { pageSize: this.pageSize, pageNum: this.currentPage, userid:this.loginid };
      getmicList(para, data => {
        console.log(data);
        this.dutyDatas = data.data.obj.datas;
        this.totals = data.data.obj.total;
      });
    },

  }
};
</script>

<style lang="scss">

</style>
