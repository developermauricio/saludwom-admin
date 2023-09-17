<template>
  <div>
    <div v-if="appointments && appointments.length > 0">
      <div v-for="(appointment, index) in appointments" :key="'appoint-'+appointment.date+index"
           :class="`mb-1`">
        <div :class="`${appointment.state === '2' || appointment.state === '3' ? 'bg-gray p-2' : ''}`">
          <div class="d-flex justify-content-between">
            <div>
              <p style="color: gray !important; font-size: 12px" class="mb-0">Fecha de cita.</p>
              <div class="d-flex align-items-center">
                <i :class="`bx bx-calendar mr-1 font-weight-bold ${appointment.state === '2' || appointment.state === '3' ? 'text-light' : ''}`"></i>
                <p :class="`m-0 ${appointment.state === '2' || appointment.state === '3' ? 'text-light' : ''}`">
                  <strong>Fecha:</strong> {{
                    appointment.date ? $moment(appointment.date).tz(timezoneUser).format('LLL') : 'No hay fecha'
                  }}</p>
              </div>
              <div class="d-flex align-items-center">
                <i :class="`bx bx-time-five font-weight-bold mr-1 ${appointment.state === '2' || appointment.state === '3' ? 'text-light' : ''}`"></i>
                <p :class="`m-0 ${appointment.state === '2' || appointment.state === '3' ? 'text-light' : ''}`">
                  <strong>Hora:</strong> {{
                    appointment.date ? $moment(appointment.date).tz(timezoneUser).format('HH:mm') : 'No hay fecha'
                  }}</p>
              </div>
            </div>
            <!-- Boton Zoom -->
            <div class="mt-2" v-if="appointment.state === '1' || appointment.state === '5'">
              <a class="btn m-1 btn-sm btn-info-zoom" :href="appointment.link_meeting_zoom" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     class="bi bi-camera-video" viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                        d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
                </svg>
                Zoom
              </a>
            </div>
          </div>
          <!-- Info doctor -->
          <div class="mt-0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <!--                <h6 :class="`text-secondary ${appointment.state === '2' || appointment.state === '3' ? 'text-light' : ''}`">-->
                <!--                  Esp. {{ appointment.doctor.user.name }}-->
                <!--                  {{ appointment.doctor.user.last_name }}</h6>-->
                <span :class="`badge bg-${ stateColorApp(appointment.state)} text-white`">
                  {{ stateTitleApp(appointment.state) }}</span>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div>
    <div v-else class="py-3">
      <h5 class="text-center">No hay citas agendadas</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: "Appointments",
  data(){
    return{
      timezoneUser: null,
    }
  },
  props: ['appointments'],
  methods:{
    stateColorApp(state) {
      switch (state) {
        case '1':
          return 'warning'
        case '2':
          return 'danger'
        case '3':
          return 'success'
        case '5':
          return 'info'
      }
    },
    stateTitleApp(state) {
      switch (state) {
        case '1':
          return 'Pendiente'
        case '2':
          return 'Cancelada'
        case '3':
          return 'Finalizada'
        case '5':
          return 'En Progreso'
      }
    }
  },
  created() {
    this.timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}
</script>

<style scoped>

</style>
