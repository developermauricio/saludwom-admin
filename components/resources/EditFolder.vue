<template>
  <div>
    <div class="p-3">
      <h3>Editar Carpeta</h3>
      <FormFolder :folder="folder" ref="formFolder"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="editFolder">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "EditFolder",
  props: ['folder'],
  data() {
    return {
      form: {
        folder: '',
        description: ''
      }
    }
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    editFolder() {
      const isValid  = this.$refs.formFolder.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de editar la información de la carpeta?',
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
          this.$axios.post(`api/v1/edit-folder/${this.folder.id}`, this.form).then(async resp => {
            this.$toast.success("La carpeta se actualizó correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateListFolder')
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al editar la carpeta. Consulte a soporte SaludWom.");
          })
        }
      })
    }
  },
  created() {
    bus.$on('dataForm', (data) => {
      this.form.folder = data.folder
      this.form.description = data.description
    })
  },
  closeModal() {
    this.$FModal.hide()
  },
}
</script>


<style scoped>

</style>
