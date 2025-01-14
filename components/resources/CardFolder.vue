<template>
  <div class="card file-manager-item folder">
    <div class="card-img-top file-logo-wrapper" @click="open(folder)">
      <div class="dropdown float-end">
        <i data-feather="more-vertical" class="toggle-dropdown mt-n25"></i>
      </div>
      <div class="d-flex align-items-center justify-content-center w-100">
        <div v-html="$feathericons['folder'].toSvg()"></div>
      </div>
    </div>
    <div class="card-body">
      <div class="content-wrapper">
        <p class="card-text file-name mb-0" @click="open(folder)">{{ folder.folder }}</p>
        <p class="card-text file-size mb-0" @click="open(folder)">{{ folder.archives_count }}</p>
        <div class="d-flex justify-content-between ml-3">
          <div>
            <a id="dropdownMenuCardFolder" data-bs-toggle="dropdown" aria-expanded="false">
              <div v-html="$feathericons['more-vertical'].toSvg()"></div>
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuCardFolder">
              <a class="dropdown-item" @click="openModalEdit(folder)">Actualizar</a>
              <a class="dropdown-item" @click="deleteResource(folder)">Eliminar</a>
            </div>
          </div>
        </div>
        <!--        <p class="card-text file-date">01 may 2019</p>-->
      </div>
      <small class="file-accessed text-muted">{{ folder.description }}</small>
    </div>
  </div>
</template>

<script>

import EditFolder from "@/components/resources/EditFolder.vue";
import {bus} from "@/plugins/bus";

export default {
  name: "CardFolder",
  props: ['folder'],
  methods: {
    openModalEdit() {
      this.$FModal.show(
        {
          component: EditFolder,
          placement: 'center center',
        },
        {
          folder: this.folder
        }
      )
    },
    deleteResource(){

      this.$swal.fire(
        {
          title: `¿Esta seguro de eliminar la carpeta <strong>${this.folder.folder}</strong>?`,
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'No',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary mr-2'
          },

          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async result => {
        if (result.value) {

          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })

          this.$axios.delete(`/api/v1/delete-folder/${this.folder.id}`).then(resp =>{
            if (resp.data.success){
              this.$toast.success("La carpeta se eliminó exitosamente.");
              bus.$emit('updateListFolder')
            }else{
              this.$toast.error('No se puede eliminar la carpeta porque hay uno o varios recursos relacionados. Consulte con soporte SaludWom.')
            }

          }).catch(e =>{
            console.log(e)
            this.$toast.error('Error al eliminar la carpeta. Consulte con soporte SaludWom.')
          }).finally(() =>{ this.$vs.loading.close() })
        }
      })

    },
    open(folder) {
      console.log(folder)
      this.$router.push(
        {
          path: `/recursos/${folder.slug}/${folder.id}`,
          params: {name: folder, countArchives: folder.archives_count}
        },
      );
    }
  }
}
</script>

<style scoped>

</style>
