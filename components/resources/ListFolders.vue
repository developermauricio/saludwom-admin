<template>
  <div>
    <div class="view-container pb-2">
      <h2 class="files-section-title mt-25 mb-75">Recursos</h2>
      <CardFolder v-for="(folder, index) in folders" :key="index" :folder="folder"/>
    </div>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
export default {
  name: "ListFolders",
  data(){
    return{
      type: 'folder',
      icon: 'folder',
    }
  },
  computed:{
    folders(){
      return cloneDeep(this.$store.getters['listFolders'])
    }
  },
  async beforeMount() {
    await this.$store.dispatch('getFolders')
  },

}
</script>

<style scoped>

</style>
