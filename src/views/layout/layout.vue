<template>
  <div id="loyout">
    <!-- <el-container>
      <layoutAside></layoutAside>
      <el-container>
        <layoutHeader></layoutHeader>
        <el-main id="elmain">
          <div class="mwrap">
            <transition name="main" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </el-main>
        <el-footer style="height:40px;">
          <Bottom></Bottom>
        </el-footer>
      </el-container>
    </el-container>-->
    <el-container class="loyoutwrap">
      <layoutHeader></layoutHeader>
      <el-container>
        <layoutAside></layoutAside>
        <el-container>
          <el-main id="elmain">
            <div class="mwrap">
              <!-- <transition name="main" mode="out-in"> -->
              <router-view></router-view>
              <!-- </transition> -->
            </div>
          </el-main>
          <el-footer style="height:40px;">
            <Bottom></Bottom>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import layoutAside from "./aside/aside";
import layoutHeader from "./header/header";
import Bottom from "./Footer/bottom";
import langSelect from "../../components/lang/langSelect";

export default {
  name: "dc-home",
  components: {
    layoutHeader,
    Bottom,
    langSelect,
    layoutAside
  },
  data() {
    return {
      systemname: JSON.parse(this.$store.getters.systemInfo).setname
    };
  },
  created() {
    document.getElementsByTagName("title")[0].innerHTML = this.systemname;
    this.$router.push("/index");
  }
};
</script>

<style lang="scss">

// //滚动条的宽度
// ::-webkit-scrollbar {
//   width: 5px;
//   height: 5px;
// }
// // 滚动条的滑块
// ::-webkit-scrollbar-thumb {
//   background-color: #999;
//   border-radius: 3px;
// }
.el-radio__inner {
  border: 1px solid #999;
}
.main-enter,
.main-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.main-enter-active {
  transition: all 0.2s;
}
.main-leave-active {
  position: absolute;
  transition: all 0.3s;
}
.import-ts {
  color: #333;
  font-size: 14px;
  margin-bottom: 20px;
  span {
    color: #f00;
  }
}
.el-input.is-disabled .el-input__inner {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #666;
  cursor: pointer;
}
.el-select .el-input.is-disabled .el-input__inner {
  cursor: pointer;
}

.el-table thead.is-group th {
  background: #1890ff;
}
.el-table--border th,
.el-table__fixed-right-patch {
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
}
.el-container.loyoutwrap {
  flex-direction: column;
}

.el-tabs__header {
  margin-bottom: 0;
}
.addcontent {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.1);
}
.el-button--primary {
  background-color: #1890ff;
  border-color: #1890ff;
}
.tableinfo {
  .title {
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
  }
  .btn {
    color: #1890ff;
    background: transparent;
    border: 0;
    padding: 0 3px;
    margin: 0;
  }
  .btn:hover {
    opacity: 0.8;
  }
}
.el-table--border,
.el-table--group {
  border: 1px solid #ddd;
}
.el-table td {
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  font-size: 13px;
}
.el-dialog__header {
  background: #1890ff;
  padding: 10px 20px;
  text-align: center;
  .el-dialog__title {
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    line-height: 34px;
    font-family: "微软雅黑";
  }
  .el-dialog__headerbtn {
    .el-dialog__close {
      color: #fff;
      font-size: 20px;
    }
  }
}
.el-dialog__footer {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
.el-step__title {
  font-size: 14px;
  line-height: 32px;
}
.batch-setting {
  .el-checkbox {
    display: block;
    margin-bottom: 8px;
    .el-checkbox__label {
      max-width: 280px;
      vertical-align: bottom;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #f00;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: #f79696;
      border-color: #f00;
    }
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
  .el-checkbox-group {
    margin-top: 14px;
  }
}
</style>
