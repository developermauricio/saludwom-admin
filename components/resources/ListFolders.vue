<template>
  <div>
    <div class="view-container pb-2">
      <h2 class="files-section-title mt-25 mb-75">Lista de Carpetas</h2>
      <CardFolder v-for="(folder, index) in folders" :key="index" :folder="folder"/>
    </div>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
import {bus} from "@/plugins/bus";

export default {
  name: "ListFolders",
  data() {
    return {
      type: 'folder',
      icon: 'folder',
    }
  },
  methods: {
    async getFolders() {

      await this.$store.dispatch('getFolders')
    }
  },
  created() {
    setTimeout(() => {
      bus.$on('updateListFolder', () => {
        this.getFolders();
      })
    }, 200)
  },
  computed: {
    folders() {
      return cloneDeep(this.$store.getters['listFolders'])
    }
  },
  async beforeMount() {
    await this.getFolders()
  },

}
</script>

<style scoped>

</style>
