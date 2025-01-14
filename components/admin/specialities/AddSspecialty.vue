<template>
  <div>
    <div class="p-3">
      <h3>Agregar Especialidad</h3>
      <FormSpecialty ref="formSpecialty"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="addSpecialty">Agregar Especialidad</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "AddSspecialty",
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
    addSpecialty() {
      const isValid = this.$refs.formSpecialty.validateData()

      if (!isValid) {
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de agregar la especialidad?',
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
          this.$axios.post('api/v1/add-treatment', this.form).then(async resp => {
            this.$toast.success("La especialidad se agrego correctamente.");
            bus.$emit('updateTableListSpecilities')
            this.$FModal.hide()
          }).catch(e => {
            console.log(e)
            this.$toast.error("Error al agregar la especialidad. Consulte a soporte SaludWom.");
          }).finally(() => { this.$vs.loading.close() })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
