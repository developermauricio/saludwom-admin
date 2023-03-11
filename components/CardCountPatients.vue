<template>
  <div>
    <div class="card-info-patients">
      <splide :slides="items" :options="options">
        <splide-slide v-for="item in items" :key="item.id">
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="fw-bolder mb-0">{{ item.total }}</h2>
                <p class="card-text">{{ nameType(item.type) }}</p>
              </div>
              <div :class="`avatar bg-light-${color(item.type)} p-50 m-0`">
                <div class="avatar-content">
                  <div class="mr-1" v-html="$feathericons['users'].toSvg()"></div>
                </div>
              </div>
            </div>
          </div>
        </splide-slide>
      </splide>
    </div>
  </div>
</template>

<script>
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default {
  name: "CardCountPatients",
  props: ['items'],
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
        // height: '5rem',
        perPage: 4,
        arrows: false,
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
            gap: '1.5rem',
          },
        },
      },
    }
  },
  methods:{
    nameType(type) {
      switch (type) {
        case 'totalPatients':
          return 'Total Pacientes'
        case 'totalPatientsM':
          return 'Total Masculino'
        case 'totalPatientsF':
          return 'Total Femenino'
        case 'totalPatientsO':
          return 'Total Otros'
        case 'totalPatientsCli':
          return 'Total Tipo Cliente'
        case 'totalPatientsCour':
          return 'Total Tipo Cortesia'
      }
    },
    color(type){
      switch (type) {
        case 'totalPatients':
          return 'secondary'
        case 'totalPatientsM':
          return 'danger'
        case 'totalPatientsF':
          return 'warning'
        case 'totalPatientsO':
          return 'info'
        case 'totalPatientsCli':
          return 'danger'
        case 'totalPatientsCour':
          return 'warning'
      }
    }
  }
}
</script>

<style scoped>

</style>
