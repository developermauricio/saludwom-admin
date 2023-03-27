<template>
  <div>
    <!--  Lista de archivos  -->
    <div class="row" v-if="archives && archives.length > 0">
      <div class="col-6" style="cursor: pointer"
           v-for="archive in archives" :key="archive.id">
        <div class="single-card p-2" @click="openModal(archive)">
          <div class="text-center">
            <img width="40" :src="require(`~/assets/img/icons/archives/${iconArchive(archive.type_file)}`)" alt="">
          </div>
          <p class="text-center">{{ archive.name_file }}</p>
        </div>
      </div>
    </div>
    <div v-else class="py-3">
      <h5 class="text-center">No hay archivos</h5>
    </div>
    <!--  Mostrando Popup Archivo  -->
    <div>
      <vs-popup  :title="archive ? archive.name_file : ''" :active.sync="popupActivo">
        <ShowArchive :archive="archive"/>
      </vs-popup>
    </div>
  </div>
</template>

<script>
export default {
  name: "Archives",
  props: ['archives'],
  data(){
    return{
      popupActivo: false,
      archive: null
    }
  },
  methods: {
    openModal(archive) {
      console.log(archive)
      setTimeout(() =>{
        this.archive = archive
        this.popupActivo = true
      }, 200)

    },
    iconArchive(type) {
      switch (type.toLowerCase()) {
        case 'mov':
          return 'icon-video.png'
        case 'mp4':
          return 'icon-video.png'
        case 'wmv':
          return 'icon-video.png'
        case 'avi':
          return 'icon-video.png'
        case 'docx':
          return 'icon-doc.png'
        case 'doc':
          return 'icon-doc.png'
        case 'pdf':
          return 'icon-pdf.png'
        case 'png':
          return 'icon-image.png'
        case 'jpg':
          return 'icon-image.png'
        case 'jpeg':
          return 'icon-image.png'
        case 'webp':
          return 'icon-image.png'
        case 'gif':
          return 'icon-image.png'
        case 'heif':
          return 'icon-image.png'
        case 'hevc':
          return 'icon-image.png'
        case 'psd':
          return 'icon-image.png'
        case 'svg':
          return 'icon-image.png'
      }
    }
  }
}
</script>

<style scoped>

</style>
