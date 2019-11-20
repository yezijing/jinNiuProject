<template>
  <div class="content-wrap working">
    <div class="tabs">
      <a
        class="item"
        :class="activeClass == index ? 'active':''"
        v-for="(item,index) in tabitem"
        :key="index"
        @click="tabsClick(index)"
        href="javascript:;"
      >{{item}}</a>
    </div>
    <div class="workwrap">
      <!-- 领导指示工作分工 -->
      <div class="jobsharing" v-if="isWorkShow">
        <leader-work></leader-work>
      </div>
      <!-- 1向上争取协调解决工作分工 -->
      <div class="jobsharing" v-if="isWorkShow2">
        <work-sharing></work-sharing>
      </div>
      <!-- 2需我区协调解决工作分工 -->
      <div class="jobsharing" v-if="isWorkShow3">
        <workarea-sharing></workarea-sharing>
      </div>
    </div>
  </div>
</template>
 
<script>
import leaderWork from "./leaderWork"; //领导指示工作分工
import workSharing from "./workSharing"; //向上争取协调解决工作分工
import workareaSharing from "./workareaSharing"; //2需我区协调解决工作分工
export default {
  name: "working",
  components: {
    leaderWork,
    workSharing,
    workareaSharing
  },
  data() {
    return {
      tabitem: [
        "现场办公会",
        // "向上争取协调解决工作分工",
        // "需我区协调解决工作分工"
      ],
      activeClass: 0,
      typemodel: 0, //1向上争取协调解决工作分工  2需我区协调解决工作分工
      isWorkShow: true, //领导指示工作分工
      isWorkShow2: false, //向上争取协调解决工作分工, 需我区协调解决工作分工
      isWorkShow3: false,
      isShow: true,
      addShow: false,
      editShow: false,
      detailShow: false,
    };
  },
  created() {
    this.centerLink();
  },
  methods: {
    // tab切换
    tabsClick(index) {
      this.activeClass = index;
      this.addShow = false;
      this.editShow = false;
      this.detailShow = false;
      this.isShow = true;
      if (index == 0) {
        this.isWorkShow = true;
        this.isWorkShow2 = false;
        this.isWorkShow3 = false;
      } else if (index == 1) {
        this.isWorkShow = false;
        this.isWorkShow3 = false;
        this.isWorkShow2 = true;
      } else {
        this.isWorkShow = false;
        this.isWorkShow3 = true;
        this.isWorkShow2 = false;
      }
    },
    centerLink() {
      if (
        this.$route.query.isWorkShow == undefined ||
        this.$route.query.isWorkShow2 == undefined ||
        this.$route.query.isWorkShow3 == undefined ||
        this.$route.query.activeClass == undefined
      ) {
        this.isWorkShow = true;
        this.isWorkShow2 = false;
        this.isWorkShow3 = false;
        this.activeClass = 0;
      } else {
        this.isWorkShow = this.$route.query.isWorkShow;
        this.isWorkShow2 = this.$route.query.isWorkShow2;
        this.isWorkShow3 = this.$route.query.isWorkShow3;
        this.activeClass = this.$route.query.activeClass;
      }
    }
  }
};
</script>

<style lang="scss">
.working {
  .tabs {
    border-bottom: 1px solid #ddd;
    .item {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      border-bottom: 2px solid transparent;
      margin-right: 28px;
    }
    .active {
      border-bottom: 2px solid #1890ff;
      color: #1890ff;
    }
  }
  .navtitle {
    display: none;
  }
  .content-wrap {
    padding: 0 !important;
  }
  .jobsharing {
    margin-top: 10px;
  }
}
</style>

