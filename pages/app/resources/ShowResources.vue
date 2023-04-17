<template>
  <div class="app-content content show-resource-folder">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row">
        <div class="content-header-left">
          <div class="row breadcrumbs-top">
            <div class="col-12 d-flex justify-content-between">
              <h1 class="content-header-title  mb-0">{{ title }}</h1>
              <!--  Botón agregar recursps   -->
              <button @click="openModal" class="btn btn-primary">Agregar<i
                v-html="$feathericons['plus'].toSvg()"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-body">
          <ListResourceVideos :folderId="folderId"/>
      </div>
    </div>
  </div>
</template>

<script>
import AddFormResource from "../../../components/resources/AddFormResource";

export default {
  name: "ShowResources",
  data(){
    return{
      title: '',
      folderId: null,
    }
  },
  methods:{
    openModal(){
      this.$FModal.show(
        {
          component: AddFormResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          folderId: this.folderId
        }
      )
    }
  },
  beforeMount() {
    let folder = this.$route.params.slug
    this.folderId = this.$route.params.id
    switch (folder) {
      case 'videos-valoracion':
        this.title = 'Videos de Valoración'
        break
      case 'logros':
        this.title = 'Logros'
        break
      case 'ejerciocios-siete-minutes':
        this.title = 'Ejercicios en 7 minutes'
        break
      case 'informacion':
        this.title = 'Información'
        break
      case 'documentos-pdf':
        this.title = 'Documentos PDF'
        break
      case 'informacion-del-sistema':
        this.title = 'Información del Sistema'
        break
    }
    console.log(this.$route.params.slug)
  }
}
</script>

<style scoped>

</style>
