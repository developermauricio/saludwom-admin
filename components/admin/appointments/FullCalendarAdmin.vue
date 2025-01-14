<template>
  <div>
    <FullCalendarComponent :appointments="appointments" @handleEventFullCalendar="showInfoEvent"/>
  </div>
</template>

<script>
import ShowInfoAppointment from "@/components/appointment/ShowInfoAppointment.vue";
import {bus} from "@/plugins/bus";

export default {
  name: "FullCalendarAdmin",
  data() {
    return {
      appointments: [],
      selectedDoctors: []
    }
  },
  created() {
    setTimeout(() => {
      bus.$on('eventSelectedDoctors', (val) => {
          this.selectedDoctors = val
      })
    }, 200)

  },
  methods: {
    showInfoEvent(appointment) {
      this.$FModal.show(
        {
          component: ShowInfoAppointment,
        },
        {
          appointment: appointment,
          doctor: appointment.doctor
        }
      )
    },

    getAppointments() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })

      const selectedDoctorIds = this.selectedDoctors.map(doctor => doctor.id);

      const selectedDoctorsParam = this.selectedDoctors.length > 0 ? `&selectedDoctors=${JSON.stringify(selectedDoctorIds)}` : '';

      this.$axios.get(`/api/v1/get-admin-appointments-agenda/?${selectedDoctorsParam}`).then(resp => {
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
  },
  watch: {
    selectedDoctors: {
      handler(val) {
        setTimeout(() => {
          console.log('SE EJECUTA')
          this.getAppointments()
        }, 200)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
