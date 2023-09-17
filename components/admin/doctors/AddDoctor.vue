<template>
  <div>
    <div class="p-3">
      <h3>Agregar Especialista</h3>
      <FormDoctor :doctor="null" ref="formDoctor"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-danger mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-success" @click="addDoctor">Agregar Especialista</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import {bus} from "../../../plugins/bus";
import FormDoctor from "./FormDoctor";
import {required} from "vuelidate/lib/validators";

export default {
  name: "AddDoctors",
  components: {FormDoctor},
  data() {
    return {
      form: {
        name: '',
        zoomApiKey: '',
        zoomApiSecret: '',
        lastName: '',
        email: '',
        birthday: null,
        phone: '',
        phoneI: '',
        biography: '',
        city: null,
        documentType: null,
        document: '',
        address: '',
        country: null,
        treatments: null,
      },
    }
  },

  created() {
    bus.$on('dataForm', (data) => {
      this.form.name = data.name
      this.form.lastName = data.lastName
      this.form.zoomApiKey = data.zoomApiKey
      this.form.zoomApiSecret = data.zoomApiSecret
      this.form.email = data.email
      this.form.birthday = data.birthday
      this.form.phone = data.phone
      this.form.phoneI = data.phoneI
      this.form.biography = data.biography
      this.form.city = data.city
      this.form.documentType = data.documentType
      this.form.document = data.document
      this.form.address = data.address
      this.form.country = data.country
      this.form.treatments = data.treatments
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },

    async addDoctor() {

      const isValid  = this.$refs.formDoctor.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de agregar el especialista?',
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
          this.$axios.post('api/v1/add-doctor', this.form).then(async resp => {
            this.$toast.success("El especialista se agrego correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateTableListDoctor')
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al agregar el especialista. Consulte a soporte SaludWom.");
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
