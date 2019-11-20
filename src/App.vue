<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,  SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4, p, span, input, textarea{font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,  SimSun, sans-serif;}
#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}
a{
  color: #56a9ff;
}
fieldset {
  border: 1px solid #ccc;
  legend {
    color: #000;
    font-size: 16px;
    padding: 0 8px;
    margin-left: 30px;
    font-weight: bold;
    font-family: "微软雅黑";
  }
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
textarea{resize: none;}
.el-pagination{margin-top: 30px;text-align: right;}
.el-form-item__label{color: #222;}
</style>
