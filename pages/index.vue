<template>
  <div>
    <Header/>
    <SidebarManu/>
    <router-view/> <!-- Componentes del sistema-->
<!--    <div class="sidenav-overlay"></div>-->
<!--    <div class="drag-target"></div>-->
<!--    <Footer/>-->
  </div>

</template>

<script>
import {subscriberMQTT} from "../plugins/mqtt";

export default {
  middleware: ['auth'],
  name: 'IndexPage',
  methods:{
    test(){
      subscriberMQTT('omaos', 'test-mqtt', (data) => {
        console.log(data)
      })
    }
  },
  mounted() {
    // this.$customScriptVendor();
    // this.$customScriptMenu();
    // this.$customScriptApp();
    this.test()
  }
}
</script>
