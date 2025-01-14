<template>
  <div class="app-content content file-manager-application border-0">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-area-wrapper container-xxl p-0 border-0">
      <div class="content-right border-0">
        <div class="content-wrapper container-xxl p-0">
          <div class="content-header row">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <h1 class="content-header-title  mb-0">Recursos</h1>
                <!--  Botón agregar cuestionario   -->
                <button @click="openModalAddFolder" class="btn btn-primary">Agregar Carpeta <i
                  v-html="$feathericons['plus'].toSvg()"></i></button>
              </div>
            </div>
          </div>
          <div class="content-body mt-3">
            <!-- overlay container -->
            <div class="body-content-overlay"></div>

            <!-- file manager app content starts -->
            <div class="file-manager-main-content">
              <div class="file-manager-content-body">
                <!-- Folders Container Starts -->
                <ListFolders/>
                <!-- /Folders Container Ends -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddFolder from "@/components/resources/AddFolder.vue";

export default {
  name: "Resources",
  methods: {
    openModalAddFolder() {

      this.$FModal.show(
        {
          component: AddFolder,
          placement: 'center top',
        },
      )
      // this.openModalAddQuestionaire = true
    }
  }
}
</script>

<style scoped>

</style>
