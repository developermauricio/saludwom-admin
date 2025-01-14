<template>
    <div class="d-flex justify-content-center align-items-center" v-if="patient.subcrition.length === 0">
      <h4>Sin suscripciones</h4>
    </div>
  <div v-else>
    <h4 class="mb-2">Lista de Suscripciones</h4>

    <splide ref="splide" :slides="listStates" :options="options" v-if="showSlide">
      <splide-slide v-for="item in listStates" :key="item.id">
        <div class="card">
          <div class="card-header">
            <div>
              <h2 class="fw-bolder mb-0">{{ item.total }}</h2>
              <p class="card-text">{{ titleState(item.type) }}</p>
            </div>
            <div :class="`avatar bg-light-${titleStateColor(item.type)} p-50 m-0 d-none d-lg-block d-md-block`">
              <div class="avatar-content">
                <div v-html="$feathericons[iconState(item.type)].toSvg()"></div>
              </div>
            </div>
          </div>
        </div>
      </splide-slide>
    </splide>
    <!--   Tabla de Suscripciones del Paciente   -->
    <div>
        <TableListSubscriptionsPatient :subscriptions="patient.subcrition"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubscriptionsPatient",
  props: ['patient'],
  data() {
    return {
      showSlide: false,
      options: {
        type: 'loop',
        rewind: true,
        drag: true,
        padding: '2rem',
        gap: '1.3rem',
        focus: 0,
        autoplay: true,
        // height: '20rem',
        perPage: 2,
        arrows: true,
        // autoWidth: true,
        pagination: false,
        trimSpace: true,
        breakpoints: {
          480: {
            autoplay: true,
            autoWidth: false,
            drag: true,
            arrows: false,
            pagination: true,
            // type   : 'loop',
            perPage: 1,
            gap: '1rem',
          },
        },
      },

      listStates: [
        {
          id: 1,
          total: this.patient.totalSubscriptions,
          type: 'totalSubscriptions'
        },
        {
          id: 2,
          total: this.patient.totalSubscriptionPending,
          type: 'totalSubscriptionPending'
        },
        {
          id: 3,
          total: this.patient.totalSubscriptionCancelled,
          type: 'totalSubscriptionCancelled'
        },
        {
          id: 4,
          total: this.patient.totalSubscriptionRejected,
          type: 'totalSubscriptionRejected'
        },
        {
          id: 5,
          total: this.patient.totalSubscriptionAccepted,
          type: 'totalSubscriptionAccepted'
        },
        {
          id: 6,
          total: this.patient.totalSubscriptionCompleted,
          type: 'totalSubscriptionCompleted'
        }
      ]
    }
  },
  methods:{
    titleState(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'Total Suscripciones'
        case 'totalSubscriptionPending':
          return 'Total Pendiente'
        case 'totalSubscriptionCancelled':
          return 'Total Cencelados'
        case 'totalSubscriptionRejected':
          return 'Total Rechazados'
        case 'totalSubscriptionAccepted':
          return 'Total Aceptados'
        case 'totalSubscriptionCompleted':
          return 'Completados'
      }
    },
    titleStateColor(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'primary'
        case 'totalSubscriptionPending':
          return 'warning'
        case 'totalSubscriptionCancelled':
          return 'danger'
        case 'totalSubscriptionRejected':
          return 'danger'
        case 'totalSubscriptionAccepted':
          return 'success'
        case 'totalSubscriptionCompleted':
          return 'info'
      }
    },
    iconState(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'list'
        case 'totalSubscriptionPending':
          return 'clock'
        case 'totalSubscriptionCancelled':
          return 'x'
        case 'totalSubscriptionRejected':
          return 'x'
        case 'totalSubscriptionAccepted':
          return 'check'
        case 'totalSubscriptionCompleted':
          return 'check-circle'
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.showSlide = true
    }, 200);
  }
}
</script>

<style scoped>

</style>
