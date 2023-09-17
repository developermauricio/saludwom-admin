<template>
  <div class="px-2">
    <h3>Disponibilidad del Esp. {{ doctor.name }}</h3>
    <hr>
    <div class="row">
      <div class="py-1">
        <h5>Horario disponible para <strong>{{ dateSelected.dateFormat }}:</strong></h5>
      </div>
      <div @click="selectHourMinute(hourMinute)" class="col-6 col-lg-2 col-md-2 mb-1"
           v-for="(hourMinute, index) in hoursMinutes" :key="index">
        <span
          :class="`badge font-small-3 cursor-pointer bg-secondary ${hourAvailable(hourMinute)} ${hourScheduled(hourMinute)} ${checkSelectedHourMinute(hourMinute)}`">{{
            hourMinute.hour
          }}:{{ hourMinute.minute }}</span>
      </div>
    </div>
    <div v-if="selectedHourMinutes.length > 0">
      <hr>
      <div class="row">
        <button class="btn btn-primary" @click="AddScheduleAvailability">Agregar disponibilidad</button>
      </div>
    </div>
  </div>
</template>

<script>
import hoursMinutes from "./availabilityData";
import {bus} from "../../plugins/bus";
import InfoAppointmentDoctor from "../admin/doctors/InfoAppointmentDoctor";

export default {
  name: "ScheduleInformation",
  props: ['doctor', 'dateSelected', 'scheduleDoctor'],
  data() {
    return {
      hoursMinutes,
      valuation: null,
      selectedHourMinutes: []
    }
  },
  created() {
    console.log(this.scheduleDoctor)
    if (!this.scheduleDoctor) {
      this.scheduleDoctor = {date: ''}; // Inicializa scheduleDoctor como un objeto vacío
    }

    if (!this.scheduleDoctor.schedules_hours_minutes) {
      this.scheduleDoctor.schedules_hours_minutes = []; // Inicializa el arreglo si no existe
    }
  },
  methods: {
    AddScheduleAvailability() {

      let data = {
        id: this.scheduleDoctor ? this.scheduleDoctor.id : null,
        doctorId: this.doctor.id,
        date: this.scheduleDoctor && this.scheduleDoctor.date ? this.scheduleDoctor.date : this.dateSelected.dateDb,
        hoursMinutes: this.selectedHourMinutes.length > 0 ? this.selectedHourMinutes : []
      }

      this.$swal.fire(
        {
          title: `¿Esta seguro de agregar el horario para la fecha: ${this.dateSelected.dateFormat}?`,
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

          this.$axios.post(`/api/v1/add-schedule-available`, data).then(resp => {
            console.log(resp.data)
            let doctorSchedule =  Object.keys(resp.data.doctorSchedule).length === 0 ? this.scheduleDoctor : resp.data.doctorSchedule
            setTimeout(() => {
              resp.data.schedules.forEach(data => {
                data.state = 'AVAILABLE';
                data.date = this.scheduleDoctor ? this.scheduleDoctor.date : this.dateSelected.dateDb
                this.scheduleDoctor.schedules_hours_minutes.push(data)
                this.hourAvailable(data)
                this.selectedHourMinutes = []
              })
              bus.$emit('updateCalendarAddDoctor')
            }, 100)

            this.$toast.success("El horario se agrego exitosamente.");
            this.$vs.loading.close()
          }).catch(e => {
            this.$vs.loading.close()
            this.$toast.error('Error al agregar horario disponible. Consulte con soporte SaludWom.')
          })
        }
      });
    },
    showInfoAppointment(hourMinute) {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      let hourMinuteSelected = this.scheduleDoctor.schedules_hours_minutes.find(item => item.hour === hourMinute.hour && hourMinute.minute)

      this.$axios.get(`/api/v1/get-valuation/${hourMinuteSelected.appointment_valuation.valuation.slug}`).then(resp => {

        this.valuation = resp.data.data
        this.$vs.loading.close()

        this.$FModal.show(
          {
            component: InfoAppointmentDoctor,
          },
          {
            valuation: this.valuation
          }
        )

      }).catch(e => {
        this.$vs.loading.close()
        this.$toast.error('Error al obtener el objetivo. Consulte con soporte SaludWom.')
      })

    },
    removeAvailability(hourMinute) {
      let hourMinuteAvailable = this.hourMinuteAvailable(hourMinute)

      this.$swal.fire(
        {
          title: `¿Esta seguro de inhabilitar este horario: ${hourMinute.hour}:${hourMinute.minute}?`,
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
            text: 'Removiendo disponibilidad...'
          })

          this.$axios.post(`/api/v1/remove-availability-hour-minute/${hourMinuteAvailable.id}/${this.doctor.id}/${this.dateSelected.dateDb}`).then(resp => {

            this.scheduleDoctor.schedules_hours_minutes.map(item => {
              if (item.id === hourMinuteAvailable.id) {
                item.state = 'UNAGENDIZED'
                this.hourAvailable(hourMinute)
              }
            })
            console.log('REMOVE', hourMinute)
            bus.$emit('updateCalendar', hourMinute, this.dateSelected.dateDb);
            this.$toast.success(`Se actualizó el horario para la fecha ${this.dateSelected.dateFormat}`);
            this.$vs.loading.close()
          }).catch(e => {
            this.$vs.loading.close()
            this.$toast.error('Error al inhabilitar la hora. Consulte con soporte SaludWom.')
          })
        }
      });
    },

    hourMinuteSelected(hourMinute) {
      if (this.scheduleDoctor) {
        return this.scheduleDoctor.schedules_hours_minutes.find(item => item.hour === hourMinute.hour && item.minute === hourMinute.minute && item.state === 'SELECTED')
      }
    },

    hourMinuteAvailable(hourMinute) {
      if (this.scheduleDoctor) {
        return this.scheduleDoctor.schedules_hours_minutes.find(item => item.hour === hourMinute.hour && item.minute === hourMinute.minute && item.state === 'AVAILABLE')
      }
    },

    checkSelectedHourMinute(hourMinute) {
      if (hourMinute) {
        let hourMinuteSelected = this.selectedHourMinutes.find(item => item.hour === hourMinute.hour && item.minute === hourMinute.minute && item.state !== 'UNAGENDIZED' && item.state !== 'AVAILABLE');
        return hourMinuteSelected ? 'selected-for-appointment-available' : ''
      }
    },
    selectHourMinute(hourMinute) {
      let index = this.selectedHourMinutes.findIndex(item => item.hour === hourMinute.hour && item.minute === hourMinute.minute);
      let hourAvailable = this.hourMinuteAvailable(hourMinute)
      let hourSelected = this.hourMinuteSelected(hourMinute)

      if (hourAvailable) {
        this.removeAvailability(hourMinute)
        return
      }
      if (hourSelected) {
        this.showInfoAppointment(hourMinute)
        return
      }

      if (index === -1) {
        return this.selectedHourMinutes.push(hourMinute);
      }
      this.selectedHourMinutes.splice(index, 1);
    },
    hourScheduled(hourMinute) {
      if (this.scheduleDoctor) {
        let hourScheduled = this.hourMinuteSelected(hourMinute)
        return hourScheduled ? 'hourScheduled' : ''
      }
    },
    hourAvailable(hourMinute) {
      if (this.scheduleDoctor) {
        let hourAvailable = this.hourMinuteAvailable(hourMinute)
        return hourAvailable ? 'hourAvailable' : ''
      }
    }
  }
  ,
  mounted() {
    bus.$on('updateData', () => {
      this.selectedHourMinutes = []
    })
  }
}
</script>

<style scoped>

</style>
