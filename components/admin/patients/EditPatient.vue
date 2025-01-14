<template>
  <div>
    <div class="p-3">
      <h3>Editar Paciente</h3>
      <FormPatient :patient="patient" ref="formPatient"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="editPatient">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "EditPatient",
  props: ['patient'],
  data() {
    return {
      form: {
        name: '',
        lastName: '',
        email: '',
        document: '',
        documentType: null,
        gender: null,
        patientType: null,
        birthday: null,
        phone: '',
        phoneI: '',
        city: null,
        country: null,
        address: '',
      }
    }
  },
  created() {
    bus.$on('dataForm', (data) => {
      this.form.name = data.name
      this.form.lastName = data.lastName
      this.form.email = data.email
      this.form.document = data.document
      this.form.documentType = data.documentType
      this.form.gender = data.gender
      this.form.patientType = data.patientType
      this.form.birthday = data.birthday
      this.form.phone = data.phone
      this.form.phoneI = data.phoneI
      this.form.city = data.city
      this.form.country = data.country
      this.form.address = data.address
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    editPatient() {

      const isValid  = this.$refs.formPatient.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de editar la información del paciente?',
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
          this.$axios.post(`api/v1/update-data-patient/${this.patient.user_id}`, this.form).then(async resp => {
            this.$toast.success("El paciente se actualizó correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateTableListPatient')
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al editar el paciente. Consulte a soporte SaludWom.");
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
