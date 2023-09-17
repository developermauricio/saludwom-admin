<template>
    <div class="p-2">
        <h3>Cita con el especialista <strong>{{doctor.name}}</strong></h3>
      <div class="d-flex justify-content-between mt-2">
        <div>
          <p style="color: gray !important; font-size: 1.1rem" class="mb-0">Fecha de cita.</p>
          <div class="d-flex align-items-center mt-1">
            <i class="bx bx-calendar mr-1 font-weight-bold"></i>
            <p class="m-0">
              <strong>Fecha:</strong>
              {{
                appointment._def.extendedProps.dateAppointment ? $moment(appointment._def.extendedProps.dateAppointment).tz(timezoneUser).format('LLL') : 'No hay fecha'
              }}</p>
          </div>
          <div class="d-flex align-items-center mt-1">
            <i class="bx bx-time-five mr-1 font-weight-bold"></i>
            <p class="m-0">
              <strong>Hora:</strong>
              {{
                appointment._def.extendedProps.dateAppointment ? $moment(appointment._def.extendedProps.dateAppointment).tz(timezoneUser).format('HH:mm') : 'No hay fecha'
              }}</p>
          </div>
        </div>

        <!-- Boton Zoom -->
        <div v-if="appointment._def.extendedProps.state === '1' || appointment._def.extendedProps.state === '5'">
          <a class="btn m-1 btn-sm btn-info-zoom" :href="appointment._def.extendedProps.linkZoom" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 class="bi bi-camera-video" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                    d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
            </svg>
            Zoom
          </a>
        </div>
      </div>

      <div class="mt-1">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span :class="`badge bg-${ stateColorApp(appointment._def.extendedProps.state)} text-white`">
                  {{ stateTitleApp(appointment._def.extendedProps.state) }}</span>
          </div>
          <div>
            <a class="btn btn-primary" target="_blank" :href="`/objetivos/${appointment._def.extendedProps.valuation.slug}`">Ver objetivo</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "ShowInfoAppointment",
  props: ['appointment', 'doctor'],
  data(){
    return{
      timezoneUser: null,
    }
  },
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
