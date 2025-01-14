<template>
  <div>
    <div class="p-3">
      <h3>Editar Especialidad</h3>
      <FormSpecialty :specialty="specialty" ref="formSpecialty"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-danger mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-success" @click="editSpecialty">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "EditSpecialty",
  props: ['specialty'],
  data(){
    return{
      form: {
        treatment: '',
        description: '',
        categories: []
      }
    }
  },
  created() {
    bus.$on('dataForm', (data) =>{
      this.form.treatment = data.treatment
      this.form.description = data.description
      this.form.categories = data.categories
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    editSpecialty() {
      const isValid = this.$refs.formSpecialty.validateData()

      if (!isValid) {
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de actualizar la especialidad?',
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
          this.$axios.post(`api/v1/edit-treatment/${this.specialty.id}`, this.form).then(async resp => {

            this.$toast.success("La especialidad se actualizó correctamente.");
            bus.$emit('updateTableListSpecilities')
            this.$FModal.hide()

          }).catch(e => {
            console.log(e)
            this.$toast.error("Error al actualizar la especialidad. Consulte a soporte SaludWom.");
          }).finally(() => { this.$vs.loading.close() })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
