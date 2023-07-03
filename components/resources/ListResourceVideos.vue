<template>
  <div class="pb-2 mt-2">
    <div class="d-flex">
      <!-- Buscar recurso -->
      <div :class="`w-${wSearch ? wSearch : '25'} mb-2`">
        <label for="">Buscar Video:</label>
        <input v-model="valueSearchResourceVideo" type="text" placeholder="Buscar..." class="form-control">
      </div>
      <!-- Filtrar tratamientos  -->
      <!--=====================================
                 FILTRAR TRATAMIENTO
            ======================================-->
      <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
        <label class="form-label" for="basicSelect">Filtrar por Tratamiento</label>
        <select :class="`form-select w-${wFilterTreatments ? wFilterTreatments : '50'}`" v-model="valueTreatment">
          <option value="">Mostrar todos</option>
          <option v-for="(treatment, index) in treatments" :key="treatment.id" :value="treatment.id">
            {{ treatment.treatment }}
          </option>
        </select>
      </div>
    </div>

    <div class="row">
      <div :class="`col-12 col-md-${cols} col-lg-${cols}`" v-for="(video, index) in videosFilter" :key="index">
        <CardResource :folderId="folderId" :resource="video" :selected="selected" :shorPreviewState="shorPreviewState"/>
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
  props: ['folderId', 'cols', 'selected', 'shorPreviewState', 'wSearch', 'wFilterTreatments'],
  data() {
    return {
      treatments: [],
      valueTreatment: null,
      valueSearchResourceVideo: String()
    }
  },
  computed: {
    videos() {
      return cloneDeep(this.$store.getters['listVideosResourceFolder'])
    },
    videosFilterByTreatment() {
      if (this.valueTreatment) {
        return this.videos.filter()
      }
      return this.videos
    },
    videosFilter() {
      if (this.valueSearchResourceVideo) {
        return this.videos.filter(video => video.resources_folder_content.name.toLowerCase().includes(this.valueSearchResourceVideo.toLowerCase()))
      }
      if (this.valueTreatment) {
        return this.videos.filter(video =>{
          return video.resources_folder_content.treatments.some(treatment =>{
            console.log('VALOR POR DEFECTO ',treatment)
            console.log('VALOR VALOR FILTRADO ',this.valueTreatment)
            return treatment.id === this.valueTreatment
          })
        })
      }
      return this.videos
    }
  },
  methods: {
    getTreatments() {
      this.$axios.get('api/v1/get-treatments').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los tratamientos. Consulte a soporte SaludWom.");
      })
    },
  },
  async beforeMount() {
    this.$vs.loading({
      color: this.$config.colorLoading,
      text: 'Espere por favor...'
    })
    await this.$store.dispatch('getVideosResourceFolder', this.folderId)
    this.$vs.loading.close()
  },
  mounted() {
    this.getTreatments()
  }
}
</script>

<style scoped>

</style>
