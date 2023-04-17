<template>
  <div class="pb-2 mt-2">
    <div class="row">
      <div class="col-12 col-md-4 col-lg-4" v-for="(video, index) in videos" :key="index">
        <CardResource :folderId="folderId"  :resource="video"/>
      </div>
    </div>
    <div v-if="$store.state.addVideoFolder.dataLoading" class="d-flex h-100 justify-content-center align-items-center">
      <h4>No hay videos 😟</h4>
    </div>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'

export default {
  name: "ListResourceVideos",

  props: ['folderId'],
  computed: {
    videos() {
      return cloneDeep(this.$store.getters['listVideosResourceFolder'])
    }
  },
  async beforeMount() {
    await this.$store.dispatch('getVideosResourceFolder', this.folderId)
  },
}
</script>

<style scoped>

</style>
