<template>
  <div>
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-primary" @click="editPatient"> Editar Información</button>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Nombre:</label>
        <p>{{ patient.name }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Tipo de documento:</label>
        <p>{{ patient.documentType.name }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Documento:</label>
        <p>{{ patient.document }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Cumpleaños:</label>
        <p>{{ this.$moment(patient.birthday).format('DD MMMM YYYY') }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Edad:</label>
        <p>{{ patient.age }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Género:</label>
        <p>{{ patient.gender.name }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Correo electrónico:</label>
        <div>
          <a :href="`mailto:${patient.email}`">{{ patient.email }}</a>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Teléfono:</label>
        <p>{{ patient.phone }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6" v-if="patient.country">
        <label class="form-label font-weight-bold" for="first-name-column">País:</label>
        <div class="d-flex align-items-center">
          <img v-if="patient.country_flag" width="20" :src="patient.country_flag" alt="" style="margin-right: 5px"/>
          <p class="m-0">{{ patient.country.name }}</p>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-md-6" v-if="patient.city">
        <label class="form-label font-weight-bold" for="first-name-column">Ciudad:</label>
        <p>{{ patient.city.name }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Tipo de paciente:</label>
        <p>{{ patient.patientType === 'client' ? 'Cliente' : 'Cortesia' }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Fecha de registro:</label>
        <p>{{ this.$moment(patient.created_at).format('DD MMMM YYYY') }}</p>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-5">
      <div class="text-center">
        <label class="form-label font-weight-bold text-center" for="first-name-column">Firma:</label>
        <div>
          <div v-if="signature">
            <img class="round"
                 :src="signature"
                 alt="avatar"
                 width="300">
          </div>
          <div v-else>
            <p>No registrada</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import EditPatient from "@/components/admin/patients/EditPatient.vue";

export default {
  name: "InformationPatient",
  props: ['patient'],
  computed: {
    signature() {

      if (this.patient.signature) {
        if (this.patient.signature.includes('user-profile.png') || this.patient.signature.includes('storage')) {
          return `${this.$config.urlBack}${this.patient.signature}`
        }
        // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
        return this.patient.signature
      }

    }
  },
  methods: {
    editPatient() {
      this.$FModal.hide()

    setTimeout(() =>{
      this.$FModal.show(
        {
          component: EditPatient,
          placement: 'center center',
        },
        {
          patient: this.patient
        }
      )
    }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
