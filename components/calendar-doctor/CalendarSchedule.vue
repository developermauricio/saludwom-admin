<template>
  <div class="py-3 px-3">
    <h2>Disponibilidad de Agenda</h2>
    <div class="row mt-2">
      <!--  CALENDARIO   -->
      <div class="col-12 col-md-5 col-lg-5">
        <Calendar v-if="showCalendar" @dateSelected="checkSchedule" :appointments="appointments"/>
      </div>
      <!--  MOSTRAR INFORMACIÓN   -->
      <div class="col-12 col-md-7 col-lg-7">
        <!--  DETALLE  -->
        <div v-if="dateSelected">
          <ScheduleInformation :doctor="doctor" :dateSelected="dateSelected" :scheduleDoctor="scheduleDoctor"
                               @checkSchedule="checkSchedule"/>
        </div>
        <!--  MENSAJE SI AÚN NO HAN SELECCIONADO FECHA  -->
        <div v-else class="d-flex justify-content-center align-content-center m-0">
          <p>Selecciona una fecha para ver disponibilidad.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "../../plugins/bus";

export default {
  name: "CalendarSchedule",
  data() {
    return {
      showCalendar: false,
      appointments: [],
      dateSelected: String(),
      scheduleDoctor: {date: '', schedules_hours_minutes: []}
    }
  },
  props: ['doctor'],
  created() {
    bus.$on('updateScheduleDoctor', () => {
      console.log('LISTO PARA ACTUALIZAR EL SCHEDULE DOCTOR')
      this.scheduleDoctor = {date: ''}
      this.scheduleDoctor.schedules_hours_minutes = [];
    })
  },
  methods: {
    checkSchedule(date) {

      this.dateSelected = date

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Verificando disponibilidad...'
      })

      this.$axios.get(`/api/v1/check-schedule-doctor/${this.doctor.id}/${this.dateSelected.dateDb}`).then(resp => {
        this.scheduleDoctor = resp.data.data ?? {date: '', schedules_hours_minutes: []}
        this.$vs.loading.close()
        this.showCalendar = true
      }).catch(e => {
        this.$vs.loading.close()
        console.log('ERROR', e);
        this.$toast.error('Error al verificar la disponibilidad de agenda. Consulte con soporte SaludWom.')
      })
    },

    getAppointmentsDoctor() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Verificando...'
      })
      this.$axios.get(`/api/v1/get-appointments-doctor/${this.doctor.id}`).then(resp => {
        this.appointments = resp.data.data
        this.showCalendar = true
        this.$vs.loading.close()
      }).catch(e => {
        this.$vs.loading.close()
        console.log('ERROR', e);
        this.$toast.error('Error al obtener la agenda. Consulte con soporte SaludWom.')
      })
    },
  },
  mounted() {
    bus.$on('updateCalendarAddDoctor', () => {
      this.showCalendar = false
      this.getAppointmentsDoctor()
    })
    this.getAppointmentsDoctor()
    bus.$on('updateHourMinute', (dateActual) => {
      this.dateSelected = {
        dateDb: dateActual,
      }
    })
  }
}
</script>

<style scoped>

</style>
