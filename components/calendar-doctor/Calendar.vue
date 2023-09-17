<template>
  <div class="calendar-component" v-if="showFlatpickr">
    <flat-pickr
      ref="flatpickrInstance"
      v-model="selectedDates"
      :config="config"
      value=""/>
  </div>
</template>

<script>
import {format, capitalize} from 'date-fns';
import es from 'date-fns/locale/es'
import {bus} from "../../plugins/bus";

export default {
  name: "Calendar",
  props: ['appointments'],
  data() {
    return {
      selectedDates: [],
      showFlatpickr: true,
      datesAppointments: [],
      config: {
        defaultDate: [],
        // maxDate: '2022-11-24',
        // weekNumbers: true,
        // disableMobile: false,
        // mode: "multiple",
        minDate: "today",
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
        onChange: (date) => {
          this.showData(date)
        },
        onDayCreate: (date, dateStr, instance, dayElem) => {
          this.dayCreate(date, dateStr, instance, dayElem)
        }
      },
    }
  },

  methods: {
    dayCreate(date, dateStr, instance, dayElem) {
      const ariaLabel = dayElem.getAttribute("aria-label");
      if (this.datesAppointments.some(app => this.formatDate(app) === ariaLabel)) {
        dayElem.classList.add("has-appointment");
        dayElem.classList.remove("selected")
      }
      dayElem.addEventListener("click", () => {
        // Mantener la clase "has-appointment" al hacer clic en una fecha marcada
        if (dayElem.classList.contains("has-appointment")) {
          dayElem.classList.add("has-appointment");
        }
      });
    },
    showData(date) {
      let dateSelected = {
        dateDb: this.$dateFns.format(date[0], 'yyyy-MM-dd'),
        dateFormat: this.$dateFns.format(date[0], 'PPPP'),
      }

      if (dateSelected) {
        this.$emit('dateSelected', dateSelected)
      }
    },

    removeScheduleHourMinute(hourMinute, date) {
      console.log(hourMinute)
      console.log(date)
      if (hourMinute) {
        let dateRemove = this.appointments.find(item => item.date === date);
        if (dateRemove) {
          console.log(dateRemove)
          let index = dateRemove.schedules_hours_minutes.findIndex(item => item.hour === hourMinute.hour && item.minute === hourMinute.minute)
          dateRemove.schedules_hours_minutes.splice(index, 1);

          if (dateRemove.schedules_hours_minutes.length === 0) {

            this.showFlatpickr = false;

            setTimeout(() => {
              let indexApp = this.appointments.findIndex(item => item.date === date)
              this.appointments.splice(indexApp, 1);

              let indexDatesAppointment = this.datesAppointments.findIndex(item => item === date)
              this.datesAppointments.splice(indexDatesAppointment, 1);
              bus.$emit('updateScheduleDoctor')
              this.showFlatpickr = true;
            }, 200)
          }
        }

      }
    },

    formatDate(date) {
      const formattedDate = format(new Date(date + 'T00:00:00'), 'MMMM d, yyyy', {locale: es});
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    },
  },
  created() {
    // Inicializar las fechas seleccionadas con las citas existentes
    this.selectedDates = this.appointments.map(appointment => appointment.date);
    this.datesAppointments = this.appointments.map(appointment => appointment.date);

    if (!this.appointments.schedules_hours_minutes) {
      this.appointments.schedules_hours_minutes = []; // Inicializa el arreglo si no existe
    }

    bus.$on('updateCalendarActive', (hourMinute, doctorSchedule) => {

      setTimeout(() => {
        if (this.appointments.schedules_hours_minutes === 0) {
          this.appointments.push()
        }
        let indexAppointment = this.appointments.findIndex(item => item.date === doctorSchedule.date)

        this.appointments[indexAppointment].schedules_hours_minutes.push(hourMinute)


      }, 500)

    })
    bus.$on('updateCalendar', (hourMinute, date) => {
      this.removeScheduleHourMinute(hourMinute, date)
    });
  }
}
</script>

<style scoped>
</style>
