<template>
  <div>
    <FullCalendarComponent :appointments="appointments" @handleEventFullCalendar="showInfoEvent"/>
  </div>
</template>

<script>

import ShowInfoAppointment from "../../appointment/ShowInfoAppointment";

export default {
  name: "FullCalendarDoctor",
  props: ['doctor'],
  data(){
    return{
      appointments: []
    }
  },
  methods: {
    showInfoEvent(appointment){

      this.$FModal.show(
        {
          component: ShowInfoAppointment,
        },
        {
          appointment: appointment,
          doctor: this.doctor
        }
      )
    },
    getAppointments() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
        this.$axios.get(`/api/v1/get-doctor-appointments-agenda/${this.doctor.id}`).then(resp => {
          this.appointments = resp.data.data
          this.$vs.loading.close()
        }).catch(e => {
          this.$vs.loading.close()
          this.$toast.error('Error al obtener la agenda. Consulte con soporte SaludWom.')
        })
    }
  },
  mounted() {
    this.getAppointments()
  }
}
</script>

<style scoped>

</style>
