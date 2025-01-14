<template>
  <div>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex ">
        <button type="button" class="btn btn-icon btn-primary waves-effect waves-float waves-light mr-2" @click="prev">
          <span v-html="$feathericons['chevron-left'].toSvg()"></span></button>
        <button type="button" class="btn btn-icon btn-primary waves-effect waves-float waves-light mr-2" @click="next">
          <span v-html="$feathericons['chevron-right'].toSvg()"></span></button>
        <button type="button" class="btn btn-icon btn-primary waves-effect waves-float waves-light" @click="today">Hoy
        </button>
      </div>

      <div>
        <h2>{{ this.title }}</h2>
      </div>

      <div class="btn-group">
        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          {{ titleView }}
        </button>
        <div class="dropdown-menu dropdown-menu dropdown-menu-end">
          <a class="dropdown-item" @click="changeView('dayGridMonth')">Mes</a>
          <a class="dropdown-item" @click="changeView('timeGridWeek')">Semana</a>
          <a class="dropdown-item" @click="changeView('timeGridDay')">Día</a>
          <a class="dropdown-item" @click="changeView('multiMonthYear')">Año</a>
          <a class="dropdown-item" @click="changeView('listWeek')">Lista</a>
        </div>
      </div>
    </div>


    <FullCalendar ref="fullCalendar" :options='calendarOptions'/>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import esLocale from '@fullcalendar/core/locales/es'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin from '@fullcalendar/list'
import { toMoment } from '@fullcalendar/moment';
import momentTimezonePlugin from '@fullcalendar/moment-timezone'

export default {
  name: "FullCalendarComponent",
  components: {
    FullCalendar
  },
  props: ['appointments'],
  data() {
    return {
      timezoneUser: null,
      title: String(),
      titleView: String,
      fullCalendarApi: null,
      calendarOptions: {
        header: false,
        plugins: [
          interactionPlugin,
          timeGridPlugin,
          dayGridPlugin,
          listPlugin,
          multiMonthPlugin,
          momentTimezonePlugin
        ],
        initialView: 'dayGridMonth',
        nowIndicator: true,
        editable: false,
        weekends: true,
        locales: [esLocale],
        locale: 'es',
        headerToolbar: false,
        noEventsContent: 'No hay citas agendadas',
        initialEvents: [],
        eventClick: this.handleEventClick,
        dateClick: function(arg) {
          let m = this.$moment.tz(arg.date, 'America/New_York');
          console.log(m.format()); // El formato en el TimeZone deseado
        }
        // initialEvents: [
        // {
        //   title: 'Evento 1',
        //   start: '2023-08-10T10:00:00',
        //   end: '2023-08-10T12:00:00',
        //   allDay: true,
        //   editable: false,
        //   backgroundColor: 'blue',
        //   borderColor: 'darkblue',
        //   textColor: 'white'
        // },
        // {
        //   title: 'Evento 2',
        //   start: '2023-08-15T14:00:00',
        //   end: '2023-08-15T16:00:00',
        //   allDay: false,
        //   editable: false,
        //   backgroundColor: 'green',
        //   borderColor: 'darkgreen',
        //   textColor: 'white'
        // }
        // ],
      }
    }
  },

  methods: {
    handleEventClick(info) {
        this.$emit('handleEventFullCalendar', info.event)
    },
    updateCalendarEvents() {
      const calendarApi = this.fullCalendarApi;

      if (calendarApi) {
        // Convierte las fechas y horas en el timezoneUser
        const eventsWithTimezone = this.calendarOptions.initialEvents.map(event => ({
          ...event,
          start: this.$moment(event.start).tz(this.timezoneUser).format(),
          end: this.$moment(event.end).tz(this.timezoneUser).format(),
        }));
        console.log(eventsWithTimezone)
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(eventsWithTimezone);
      }
    },
    customTitle() {
      this.title = this.fullCalendarApi.currentData.viewTitle
    },
    today() {
      this.fullCalendarApi.today()
      this.customTitle()
    },
    next() {
      this.fullCalendarApi.next()
      this.customTitle()
    },
    prev() {
      this.fullCalendarApi.prev()
      this.customTitle()
    },
    changeView(viewName) {
      this.fullCalendarApi.changeView(viewName);
      this.titleView = this.fullCalendarApi.currentData.viewSpec.buttonTextDefault
      this.customTitle()
    },
  },
  watch: {
    appointments: {
      handler(newAppointments) {
        this.calendarOptions.initialEvents = newAppointments;
        this.updateCalendarEvents();
      },
      immediate: true
    }
  },
  mounted() {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (userTimeZone) {
        this.timezoneUser = userTimeZone;
      } else {
        // Si no se pudo obtener la zona horaria del navegador, establecer una predeterminada
        this.timezoneUser = 'Europe/Madrid'; // Por ejemplo, configurar como UTC
      }
    } catch (error) {
      console.error('Error al obtener la zona horaria:', error);
      // En caso de un error, también puedes establecer una zona horaria predeterminada
      this.timezoneUser = 'Europe/Madrid';
    }

    this.fullCalendarApi = this.$refs.fullCalendar.getApi()
    this.titleView = this.fullCalendarApi.currentData.viewSpec.buttonTextDefault
    this.customTitle()
  },
}
</script>

<style>

</style>
