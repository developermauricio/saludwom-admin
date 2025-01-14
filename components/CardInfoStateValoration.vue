<template>
  <div>
    <div>
      <div class="card-info-patients">
        <splide :slides="countDataStateValoration" :options="options">
          <splide-slide v-for="item in countDataStateValoration" :key="item.id">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "CardInfoStateValoration",
  props:['countDataStateValoration'],
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
  methods:{
    titleState(type){
      switch (type) {
        case 'totalValorations':
          return 'Total Objetivos'
        case 'totalPendSendRes':
          return 'Pend. Enviar Recursos'
        case 'totalResSendFromDoctor':
          return 'Recursos Enviados'
        case 'totalPendSendTreaFromDoctor':
          return 'Pend. Enviar Tratami..'
        case 'totalInTreatment':
          return 'En Tratamiento'
        case 'totalFinished':
          return 'Finalizado'
      }
    },
    titleStateColor(type){
      switch (type) {
        case 'totalValorations':
          return 'primary'
        case 'totalPendSendRes':
          return 'warning'
        case 'totalResSendFromDoctor':
          return 'info'
        case 'totalPendSendTreaFromDoctor':
          return 'danger'
        case 'totalInTreatment':
          return 'primary'
        case 'totalFinished':
          return 'success'
      }
    },
    iconState(type) {
      switch (type) {
        case 'totalValorations':
          return 'list'
        case 'totalPendSendRes':
          return 'clock'
        case 'totalResSendFromDoctor':
          return 'send'
        case 'totalPendSendTreaFromDoctor':
          return 'folder-plus'
        case 'totalInTreatment':
          return 'heart'
        case 'totalFinished':
          return 'check-circle'
      }
    }
  }
}
</script>

<style scoped>

</style>
