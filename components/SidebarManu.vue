<template>
  <div>
        <MenuAdministrator/>
  </div>
</template>

<script>


export default {
  name: "SidebarManu",
  components: {
  },
  data() {
    return {
      initialShow: true,

    };
  },
}
</script>

<style lang="scss">
/* @import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss"; */
@import "node_modules/vue-bootstrap-sidebar/src/scss/default-theme";
#content.sidebar{
  display: none !important;
}
#sidebarButton{
  display: none !important;
}
</style>
