<template>
  <div>
    <div class="p-3">
      <h3>Agregar Paciente</h3>
      <FormPatient :patient="null" ref="formPatient"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="addPatient">Agregar Paciente</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "AddPatient",
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
        plan: null,
        observations: ''
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
      this.form.plan = data.plan
      this.form.observations = data.observations
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    addPatient() {

      const isValid  = this.$refs.formPatient.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de agregar el paciente?',
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
          this.$axios.post('api/v1/add-patient', this.form).then(async resp => {
            this.$toast.success("El paciente se agrego correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateTableListPatient')
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
