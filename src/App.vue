<template>

  <router-view></router-view>

</template>
<script>

export default {
  created () {
    this.$store.dispatch('initUserInfo')
  }
}
</script>
<style lang="less">

</style>
