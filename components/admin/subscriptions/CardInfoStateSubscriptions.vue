<template>
  <div>
    <splide :slides="countDataStateSubscription" :options="options">
    <splide-slide v-for="item in countDataStateSubscription" :key="item.id">
      <div class="card text-center">
        <div class="card-body">
          <div :class="`avatar bg-light-${titleStateColor(item.type)} p-50 mb-1`">
            <div class="avatar-content">
              <div v-html="$feathericons[iconState(item.type)].toSvg()"></div>
            </div>
          </div>
          <h2 class="fw-bolder">{{ item.total }}</h2>
          <p class="card-text">{{ titleState(item.type) }}</p>
        </div>
      </div>
    </splide-slide>
    </splide>
  </div>
</template>

<script>
export default {
  name: "CardInfoStateSubscriptions",
  props: ['countDataStateSubscription'],
  data(){
    return{
      options: {
        type: 'loop',
        rewind: true,
        drag: true,
        padding: '2rem',
        gap: '1.3rem',
        focus: 0,
        autoplay: true,
        // height: '20rem',
        perPage: 4,
        arrows: true,
        // autoWidth: true,
        pagination: false,
        trimSpace: true,
        breakpoints: {
          480: {
            autoplay: true,
            autoWidth: false,
            drag: true,
            pagination: true,
            // type   : 'loop',
            perPage: 1,
            gap: '1.2rem',
          },
        },
      },
    }
  },
  methods: {
    titleState(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'Total Suscripciones'
        case 'totalPending':
          return 'Total Pendiente'
        case 'totalCancelled':
          return 'Total Cencelados'
        case 'totalRejected':
          return 'Total Rechazados'
        case 'totalAccepted':
          return 'Total Aceptados'
        case 'totalCompleted':
          return 'Completados'
      }
    },
    titleStateColor(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'primary'
        case 'totalPending':
          return 'warning'
        case 'totalCancelled':
          return 'danger'
        case 'totalRejected':
          return 'danger'
        case 'totalAccepted':
          return 'success'
        case 'totalCompleted':
          return 'info'
      }
    },
    iconState(type) {
      switch (type) {
        case 'totalSubscriptions':
          return 'list'
        case 'totalPending':
          return 'clock'
        case 'totalCancelled':
          return 'x'
        case 'totalRejected':
          return 'x'
        case 'totalAccepted':
          return 'check'
        case 'totalCompleted':
          return 'check-circle'
      }
    }
  }
}
</script>

<style scoped>

</style>
