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
      <!-- 重点工作情况推进 -->
      <div class="jobsharing" v-if="isWorkShow">
        <key-work></key-work>
      </div>
      <!-- 重要片区情况推进 -->
      <div class="jobsharing" v-if="isWorkShow2">
        <key-area></key-area>
      </div>
      <!-- 重大项目情况 -->
      <div class="jobsharing" v-if="isWorkShow3">
        <key-item></key-item>
      </div>
    </div>
  </div>
</template>
 
<script>
import keyWork from "./keywork"; //重点工作情况推进
import keyArea from "./keyarea"; //重要片区情况推进
import keyItem from "./keyitem"; //重大项目情况
export default {
  name: "threework",
  components: {
    keyWork,
    keyArea,
    keyItem
  },
  data() {
    return {
      tabitem: ["重点工作情况推进", "重要片区情况推进", "重大项目情况"],
      activeClass: 0,
      isWorkShow: true, //重点工作情况推进
      isWorkShow2: false, //重要片区情况推进
      isWorkShow3: false, //重大项目情况
    };
  },
  created() {
    this.centerLink();
  },
  methods: {
    // tab切换
    tabsClick(index) {
      this.activeClass = index;
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


