<template>
    <div>
      <div class="card-info-patients">
        <splide :slides="countDataInfo" :options="options">
          <splide-slide v-for="item in countDataInfo" :key="item.id">
            <div class="card text-center">
              <div class="card-body">
                <div :class="`avatar bg-light-${color(item.type)} p-50 mb-1`">
                  <div class="avatar-content">
                    <div v-html="$feathericons['users'].toSvg()"></div>
                  </div>
                </div>
                <h2 class="fw-bolder">{{ item.total }}</h2>
                <p class="card-text">{{ nameType(item.type) }}</p>
              </div>
            </div>
          </splide-slide>
        </splide>
      </div>
    </div>
</template>

<script>
export default {
  name: "CardInfoPatients",
  props: ['countDataInfo'],
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
    nameType(type) {
      switch (type) {
        case 'totalPatients':
          return 'Total Pacientes'
        case 'totalMale':
          return 'Total Masculino'
        case 'totalFemale':
          return 'Total Femenino'
        case 'totalOther':
          return 'Total Otros'
        // case 'totalPatientsCli':
        //   return 'Total Tipo Cliente'
        // case 'totalPatientsCour':
        //   return 'Total Tipo Cortesia'
      }
    },
    color(type){
      switch (type) {
        case 'totalPatients':
          return 'primary'
        case 'totalMale':
          return 'danger'
        case 'totalFemale':
          return 'warning'
        case 'totalOther':
          return 'info'
      }
    }
  }
}
</script>

<style scoped>

</style>
