<template>
  <div>
    <div class="row">
      <div class="col-12">
        <p>Para agendar una cita, primero selecciona el especialista</p>
      </div>
    </div>
    <div class="row">

      <div class="col-md-6 col-lg-6 col-12">
        <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.patient.$error }">Seleccionar
          Paciente
          <span class="text-danger">*</span></label>
        <multiselect
          v-model="form.patient"
          :options="patients"
          :searchable="true"
          :close-on-select="true"
          :custom-label="nameSelect"
          track-by="id"
          selectedLabel="Seleccionado"
          deselectLabel=""
          selectLabel="Selecciona"
          :show-labels="true"
          placeholder="Buscar paciente..."></multiselect>
      </div>

      <div class="col-md-6 col-lg-6 col-12" v-if="form.patient">
        <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.doctor.$error }">Seleccionar
          Especialista
          <span class="text-danger">*</span></label>
        <multiselect
          v-model="form.doctor"
          :options="doctors"
          :searchable="true"
          :close-on-select="true"
          :custom-label="nameSelect"
          track-by="id"
          selectedLabel="Seleccionado"
          deselectLabel=""
          selectLabel="Selecciona"
          :show-labels="true"
          placeholder="Buscar especialista..."></multiselect>
      </div>
    </div>
<!--  SE HA SELECCIONADO UN ESPECIALISTA Y SE MUESTRA LE CALENDARIO  -->
    <div class="row" v-if="form.doctor && form.patient">
      <div class="col-12">
        <DoctorSchedule :data="form.doctor"/>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";

export default {
  name: "FormAppointment",
  data() {
    return {
      doctors: [],
      patients: [],
      dateFilter: null,
      form: {
        doctor: null,
        patient: null,
      }
    }
  },
  validations: {
    form: {
      doctor: {required},
      patient: {required}
    }
  },
  methods:{
    nameSelect({user}) {
      return `${user.name} ${user.last_name}`
    },
    getDoctors() {
      this.$axios.get('/api/v1/get-doctors').then(resp => {
        this.doctors = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los planes. Consulte a soporte SaludWom.");
      })
    },

    getPatients(){
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      this.$axios.get(`/api/v1/get-patients-admin/${JSON.stringify(this.dateFilter)}`).then(resp => {

        this.patients = resp.data.data

        this.$vs.loading.close()
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Error al obtener los datos de los pacientes. Consulte a soporte SaludWom");
      })
    }
  },
  mounted() {
    this.getDoctors()
    this.getPatients()
  }
}
</script>

<style scoped>

</style>
