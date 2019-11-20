<template>
  <div class="headwrap">
    <el-header id="header">
      <!-- <span class="hideAside" @click="collapse"><i class="fa fa-indent fa-lg"></i></span> -->
      <p class="htitle">
        <img class="logo" :src="logoimg"> {{systemname}}
        <span class="hideAside" @click="collapse"><i class="fa fa-indent fa-lg"></i></span>
      </p>
      <ul class="personal">
        <li class="fullScreen" @click="fullScreen">
          <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
            <i class="fa fa-arrows-alt fa-lg"></i>
          </el-tooltip>
        </li>
        <!-- <li>
          <el-badge :is-dot="isDot" class="item">
            <el-button @click="goCenter">消息</el-button>
          </el-badge>
        </li> -->
        <li>
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              欢迎回来！
              {{loginname}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="a">{{ $t('userDropdownMenu.basicInfor') }}</el-dropdown-item> -->
              <!-- <el-dropdown-item command="b">{{ $t('userDropdownMenu.changePassword') }}</el-dropdown-item> -->
              <el-dropdown-item command="logout" divided>{{ $t('userDropdownMenu.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </el-header>
    <!-- <tabNav></tabNav> -->
  </div>
</template>

<script>
import Cookies from "js-cookie";
import langSelect from "../../../components/lang/langSelect";
// import tabNav from "./tabNav";
import { logout, systemDetail } from "../../../api/api";

export default {
  name: "Header",
  components: { langSelect },
  data() {
    return {
      // logoimg: "./static/images/logo2.png",
      isfullScreen: true,
      loginname: JSON.parse(this.$store.getters.userdata).logname,
      isDot: true,
      // systemname:'金牛区目标督查智慧办公平台',
      systemname: JSON.parse(this.$store.getters.systemInfo).setname,
      logoimg: JSON.parse(this.$store.getters.systemInfo).logoUrl,
    };
  },
  created(){},
  methods: {
    collapse() {
      this.$store.dispatch("collapse");
    },
    fullScreen() {
      if (this.isfullScreen) {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        this.isfullScreen = false;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isfullScreen = true;
      }
    },
    handleCommand(command) {
      if (command === "logout") {
        logout("", ({ data: { code, msg } }) => {
          if (code === "0") {
            sessionStorage.removeItem("token");
            location.reload();
          }
        });
        // sessionStorage.removeItem("token");
        //   location.reload()
      }
      if (command === "a") {
        this.$router.push({ path: "/personCenter" });
      }
      if (command === "b") {
        this.$router.push({ path: "/changePassword" });
      }
    },
    goCenter() {
      this.$router.push({ path: "/personCenter" });
    }
  }
};
</script>

<style lang="scss">
$top: top;
$bottom: bottom;
$left: left;
$right: right;
$leftright: ($left, $right);
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

html,
body,
#app,
.el-container,
#asideNav,
ul.el-menu {
  @extend %h100;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}
.headwrap {
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 9;
  .el-badge {
    .el-badge__content.is-fixed {
      top: 23px;
    }
    .el-button {
      background: #fff;
      padding: 0;
      border: 0;
    }
  }
}
#header {
  height: 60px;
  line-height: 60px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #f0f2f5;
  .htitle {
    color: #333;
    font-size: 20px;
    .logo {
      height: 36px;
      vertical-align: middle;
      margin-right: 5px;
      width: auto;
    }
    .hideAside{
      margin-left: 15px;
    }
  }
  .hideAside {
    @extend %cursor;
  }
  .personal {
    display: flex;
    flex-direction: row;
    li {
      @include set-value(margin, 13px);
      font-size: 14px;
    }
    .fullScreen {
      @extend %cursor;
    }
    .el-dropdown-link {
      @extend %cursor;
    }
  }
}
.el-dropdown-menu__item--divided{border-top: none;margin-top: 0;}
.el-dropdown-menu__item{line-height: 20px;}
</style>
