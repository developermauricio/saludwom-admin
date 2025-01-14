<template>
  <div class="mt-2">
    <div class="d-flex justify-content-center align-items-center" v-if="patient.valoration.length === 0">
      <h4>Sin objetivos</h4>
    </div>
    <div v-else>
      <h4 class="mb-2">Lista de Objetivos</h4>

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

      <!--   Tabla de Objetivos del Paciente   -->
      <div>
        <TableListObjectivesPatient :valorations="patient.valoration"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ObjectivesPatient",
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
          total: this.patient.totalValorations,
          type: 'totalValorations'
        },
        {
          id: 2,
          total: this.patient.totalPendSendRes,
          type: 'totalPendSendRes'
        },
        {
          id: 3,
          total: this.patient.totalResSendFromDoctor,
          type: 'totalResSendFromDoctor'
        },
        {
          id: 4,
          total: this.patient.totalPendSendTreaFromDoctor,
          type: 'totalPendSendTreaFromDoctor'
        },
        {
          id: 5,
          total: this.patient.totalInTreatment,
          type: 'totalInTreatment'
        },
        {
          id: 6,
          total: this.patient.totalFinished,
          type: 'totalFinished'
        }
      ]
    }
  },
  methods: {
    titleState(type) {
      switch (type) {
        case 'totalValorations':
          return 'Total Objetivos'
        case 'totalPendSendRes':
          return 'Pend. Enviar Recursos'
        case 'totalResSendFromDoctor':
          return 'Recursos Enviados'
        case 'totalPendSendTreaFromDoctor':
          return 'Pend. Enviar Tratamientos'
        case 'totalInTreatment':
          return 'En Tratamiento'
        case 'totalFinished':
          return 'Finalizado'
      }
    },
    titleStateColor(type) {
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
    },
    initializeSplide() {
      if (this.$refs.splide) {
        this.$refs.splide.splide(); // Inicializa el carrusel Splide
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
