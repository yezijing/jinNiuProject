<template>
  <div class="foot">
    <p>Copyright © 2019 {{unitname}}.  </p>
    <p>技术支持：四川联智科技有限责任公司</p>
  </div>
</template>

<script>
export default {
  name: 'bottom',
  data() {
    return {
      unitname: JSON.parse(this.$store.getters.systemInfo).unitname,
    };
  },
}
</script>

<style scoped lang="scss">
.foot{display: flex;justify-content: space-between;}
p{
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 12px;
  color: #999999;
}
</style>
