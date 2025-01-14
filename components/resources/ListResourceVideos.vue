<template>
  <div class="pb-2 mt-2">
<!--    <div class="d-flex">-->
<!--      &lt;!&ndash; Buscar recurso &ndash;&gt;-->
<!--      <div :class="`w-${wSearch ? wSearch : '25'} mb-2`">-->
<!--        <label for="">Buscar Recurso:</label>-->
<!--        <input v-model="valueSearchResourceVideo" type="text" placeholder="Buscar..." class="form-control">-->
<!--      </div>-->
<!--      &lt;!&ndash; Filtrar especialidades  &ndash;&gt;-->
<!--      &lt;!&ndash;=====================================-->
<!--                 FILTRAR ESPECIALIDADES-->
<!--            ======================================&ndash;&gt;-->
<!--      <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">-->
<!--        <label class="form-label" for="basicSelect">Filtrar por especialidad</label>-->
<!--        <select :class="`form-select w-${wFilterTreatments ? wFilterTreatments : '50'}`" v-model="valueTreatment">-->
<!--          <option value="">Mostrar todos</option>-->
<!--          <option v-for="(treatment, index) in treatments" :key="treatment.id" :value="treatment.id">-->
<!--            {{ treatment.treatment }}-->
<!--          </option>-->
<!--        </select>-->
<!--      </div>-->
<!--    </div>-->

    <div class="row mt-2">

      <!--=====================================
           TARJETAS
       ======================================-->

<!--      <div :class="`col-12 col-md-${cols} col-lg-${cols}`" v-for="(video, index) in videosFilter" :key="index">-->
<!--        <CardResource :folderId="folderId" :resource="video" :selected="selected" :shorPreviewState="shorPreviewState"/>-->
<!--      </div>-->

      <!--=====================================
           TABLA
       ======================================-->
      <div>
        <TableResource
          :folderId="folderId"
          :resources="videosFilter"
          @searchResource="searchResource"
          @updateGetResources="getResources"
        />
      </div>
    </div>
    <div class="d-flex h-100 mt-5 justify-content-center align-items-center">
      <h4 class="text-opacity-25" v-if="noResources">No hay recursos</h4>
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
      loading: true,
      noResources: true,
      treatments: [],
      valueTreatment: null,
      valueSearchResourceVideo: String()
    }
  },
  created() {
    this.noResources = false
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
        return this.videos.filter(video => {
          return video.resources_folder_content.treatments.some(treatment => {

            return treatment.id === this.valueTreatment
          })
        })
      }
      return this.videos
    }
  },
  methods: {
    searchResource(data) {
      this.videosFilter = data
    },
    getTreatments() {
      this.$axios.get('api/v1/get-treatments-actives').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las especialidades. Consulte a soporte SaludWom.");
      })
    },

    getResources(){
      setTimeout(async () => {

        await this.$store.dispatch('getVideosResourceFolder', this.folderId)

        this.noResources = this.videos.length === 0

        this.$vs.loading.close()
      }, 200)
    }
  },
  async beforeMount() {
    this.getResources()
  },
  mounted() {
    this.$vs.loading({
      color: this.$config.colorLoading,
      text: 'Espere por favor...'
    })
    this.$store.commit('SET_VIDEO_CLEAR_DATA')
    this.getTreatments()
  },
  watch: {
    'videos.length': function (newLength) {
      console.log(newLength)
      this.noResources = newLength === 0;
    }
  }
}
</script>

<style scoped>

</style>
