<template>
  <div>
    <div class="p-3">
      <h3>Agregar Carpeta</h3>
      <FormFolder :folder="null" ref="formFolder"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="addFolder">Agregar Carpeta</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "AddFolder",
  data() {
    return {
      form: {
        folder: '',
        description: ''
      }
    }
  },
  created() {
    bus.$on('dataForm', (data) => {
        this.form.folder = data.folder
        this.form.description = data.description
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },

    addFolder() {

      const isValid  = this.$refs.formFolder.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de agregar la carpeta?',
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
          this.$axios.post('api/v1/add-folder', this.form).then(async resp => {
            this.$toast.success("La carpeta se agrego correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateListFolder')
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al agregar el paciente. Consulte a soporte SaludWom.");
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
