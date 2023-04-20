<template>
  <div class="pb-2 mt-2">
    <div class="w-50 mb-2">
      <label for="">Buscar Video:</label>
      <input v-model="valueSearchResourceVideo" type="text" placeholder="Buscar..." class="form-control">
    </div>
    <div class="row">
      <div :class="`col-12 col-md-${cols} col-lg-${cols}`" v-for="(video, index) in videosFilter" :key="index">
          <CardResource :folderId="folderId"  :resource="video" :selected="selected"/>
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
  props: ['folderId', 'cols', 'selected'],
  data(){
    return{
      valueSearchResourceVideo: String()
    }
  },
  computed: {
    videos() {
      return cloneDeep(this.$store.getters['listVideosResourceFolder'])
    },
    videosFilter() {
      if (this.valueSearchResourceVideo) {
        return this.videos.filter(video => video.resources_folder_content.name.toLowerCase().includes(this.valueSearchResourceVideo.toLowerCase()))
      }
      return this.videos
    }
  },
  async beforeMount() {
    this.$vs.loading({
      color: this.$config.colorLoading,
      text: 'Espere por favor...'
    })
    await this.$store.dispatch('getVideosResourceFolder', this.folderId)
    this.$vs.loading.close()
  },
}
</script>

<style scoped>

</style>
