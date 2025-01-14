<template>
  <div>
    <div class="p-4 schedule-doctor">
      <div class="d-flex justify-content-center">
        <div class="d-flex justify-content-end align-items-end">
          <img class="avatar-profile" width="60" :src="`${$config.urlBack}${data.user.picture}`" v-if="data.user.picture" alt="SaludWoM">
          <img class="avatar-profile" width="60" src="@/assets/img/user-profile.png" alt="SaludWoM" v-else>
        </div>
        <div class="ml-2 mt-2">
          <div class="d-flex">
            <h5 class="mb-1">{{ data.user.name }} {{ data.user.last_name }}</h5>
          </div>
          <p class="mb-0 text-primary">Profesional Especialista</p>
        </div>
      </div>
      <div class="mt-4" v-if="subscription">
        <p>Recuerda que actualmente tienes activo el <strong class="text-primary">{{ subscription.plan.name }}</strong>
          que permite agendar <strong class="text-primary">{{ subscription.plan.number_appointments }} citas.</strong>
          Después de agendar tu primera cita, la siguiente tendrá que ser en los próximos <strong
            class="text-primary">{{ subscription.plan.time_interval_appointments }}
            días.</strong></p>
        <p class="text-danger font-italic fw-500">Tenga en cuenta que el calendario mostrará los horarios disponibles en
          zona horaria Europa Madrid, agenda tu cita y podrás ver la fecha en tu zona horaria.</p>
      </div>
      <hr>
      <!-- Calendario de disponibilidad    -->
      <div v-for="(appointment, indexAppoint) in $v.appointments.$each.$iter" :key="indexAppoint">
        <vs-collapse>
          <vs-collapse-item :open="true">
            <div slot="header">
              <div class="d-flex">
                <div :class="{ 'text-danger': appointment.hour.$error }">
                  Agenda tu {{ titleNumberAppointment(indexAppoint) }} cita
                </div>
                <div v-if="appointments[indexAppoint].hour">
                  <vs-tooltip text="Cita agendada">
                    <i class="bx bx-check-circle check-appointment ml-1"></i>
                  </vs-tooltip>
                </div>
              </div>
              <ul>
                <li v-if="appointment.date.$error" class="text-danger font-weight-bold">* Selecciona una fecha</li>
                <li v-if="appointment.hour.$error" class="text-danger font-weight-bold">* Selecciona una hora</li>
              </ul>

              <div v-if="appointments[indexAppoint].hour">
              <span class="badge bg-success ms-2 text-white">{{
                  transformTimezone(appointments[indexAppoint].date + ' ' + appointments[indexAppoint].hour) + ':00 ' + timezoneUser
                }}</span><br>

                <span
                  class="badge bg-light ms-2 text-light">{{ $moment(appointments[indexAppoint].date + ' ' + appointments[indexAppoint].hour).format('LLL') + ':00 ' + $config.timezone }}</span>
              </div>
              <!--            <p v-if="appointment.date.$error" class="text-danger font-weight-bold">Selecciona una fecha</p>-->
              <!--            <p v-if="appointment.hour.$error" class="text-danger font-weight-bold">Selecciona una hora</p>-->
              <div v-if="indexAppoint > 0">
                <a class="btn m-1 mt-3 btn-sm btn-danger" @click="removedAppointment(indexAppoint)"
                   style="z-index: 999999">Quitar
                  Cita</a>
              </div>
            </div>
            <div :id="`appointment-${indexAppoint}`">
              <flat-pickr
                v-model="appointment.date.$model"
                :config="config"
                @on-change="calendarOnChange"
                @input="indexAppointment(indexAppoint)"
                value=""/>
            </div>
            <div class="mt-3 mb-3">
              <div class="text-center">
                <label class="form-label">Selecciona la fecha disponible y luego el horario:</label>
              </div>
              <div class="row pr-4 pl-4 justify-content-center justify-content-center">
                <div class="mr-2" v-for="(time, indexTimes) in appointments[indexAppoint].times" :key="indexTimes">
                  <h5 @click="selectHour(time, indexAppoint, appointment.date.$model)">
                    <vs-tooltip :text="stateTitleTime(time.state)">
            <span
              :class="[time.hour+':'+time.minute+':00' === (appointments[indexAppoint] ? appointments[indexAppoint].hour : '') ? 'active' : '' ,
              `badge ${time.state === 'SELECTED' ? 'bg-hour-selected':'bg-hour select-hour-schedule'}   ms-2 text-white`, `${time.hour+':'+time.minute+':00' === timeAvailable(time.hour+':'+time.minute+':00', indexAppoint) ? '': ''}`]"
            >{{ time.hour }}:{{ time.minute }}
            </span>
                    </vs-tooltip>
                  </h5>
                </div>
              </div>
            </div>

          </vs-collapse-item>
        </vs-collapse>
        <hr>
        <div v-if="subscription">
          <button class="btn btn-success" @click="addAppointment(index + 1)"
                  v-if="appointments.length < subscription.plan.number_appointments"> Agendar la siguiente cita
          </button>
        </div>
      </div>
      <!-- Boton para agendar la segunda cita -->
      <div class="mt-4 d-flex" v-if="subscription">
        <button class="btn-secondary btn mr-2" @click="cancelAppointment"> Cancelar</button>

        <button class="btn btn-success" @click="saveAppointment()"
                v-if="appointments.length === subscription.plan.number_appointments"> Guardar Citas
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "DoctorSchedule",
  props: ['data', 'subscription'],
  data(){
    return{
      checkSchedule: [],
      subscription: null,

      config: {
        // maxDate: '2022-11-24',
        // weekNumbers: true,
        disableMobile: false,
        inline: true,
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'M j, Y',
        altInput: true,
        dateFormat: 'Y-m-d',
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
            longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          },
          months: {
            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Оct', 'Nov', 'Dic'],
            longhand: ['Enero', 'Febrero', 'Мarzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          },
        },
        enable: []
      },
    }
  },
  methods: {
    async checkScheduleAvailable() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Verificando disponibilidad...'
      })
      await this.$axios.get(`/api/v1/check-schedule-available/${this.data.id}`).then(resp => {
        resp.data.data.doctor_schedule.forEach((item) => {
          this.config.enable.push(item.date)
        })
        this.checkSchedule = resp.data.data.doctor_schedule

      }).catch(e => {
        console.log('ERROR', e);
        this.$toast.error('Error al verificar la disponibilidad de agenda. Consulte a soporte SaludWom.')
      }).finally(() =>{
        this.$vs.loading.close()
      })
    },
  },
  mounted() {
    setTimeout(() =>{

      this.checkScheduleAvailable()
    }, 500)
  }
}
</script>


<style scoped>

</style>
