<template>
  <div>
    <splide :slides="countDataStateOrders" :options="options">
      <splide-slide v-for="item in countDataStateOrders" :key="item.id">
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
  name: "CardInfoStateOrders",
  props: ['countDataStateOrders'],
  data() {
    return {
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
        case 'totalOrders':
          return 'Total Ordenes'
        case 'totalPending':
          return 'Total Pendiente'
        case 'totalCancelled':
          return 'Total Cencelados'
        case 'totalRejected':
          return 'Total Rechazados'
        case 'totalAccepted':
          return 'Total Aceptados'
      }
    },
    titleStateColor(type) {
      switch (type) {
        case 'totalOrders':
          return 'primary'
        case 'totalPending':
          return 'warning'
        case 'totalCancelled':
          return 'danger'
        case 'totalRejected':
          return 'danger'
        case 'totalAccepted':
          return 'success'
      }
    },
    iconState(type) {
      switch (type) {
        case 'totalOrders':
          return 'list'
        case 'totalPending':
          return 'clock'
        case 'totalCancelled':
          return 'x'
        case 'totalRejected':
          return 'x'
        case 'totalAccepted':
          return 'check'
      }
    }
  }
}
</script>

<style scoped>

</style>
