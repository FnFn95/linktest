<template>
  <div id="app" v-if="isReloadAlive"><router-view /></div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  name: 'app',
  data() {
    return {
      isReloadAlive: true
    };
  },
  methods: {
    reload() {
      this.isReloadAlive = false;
      this.$nextTick(function() {
        this.isReloadAlive = true;
      });
    }
  }
};
</script>
<style>
/* 全站通用样式 */
:root,
html,
body {
  color: #4c4c4c;
  background-color: #f9f9f9 !important;
}
a:hover {
  color: #ff8b00 !important;
}
</style>
