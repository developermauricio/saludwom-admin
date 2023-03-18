<template>
  <div>

    <div class="row">
      <div class="col-xl-2 col-md-4 col-sm-6 col-6" v-for="(item, index) in countDataStateValoration" :key="index">
        <div class="card text-center">
          <div class="card-body">
            <div :class="`avatar bg-light-${titleStateColor(item.type)} p-50 mb-1`">
              <div class="avatar-content">
                <i data-feather="eye" class="font-medium-5"></i>
              </div>
            </div>
            <h2 class="fw-bolder">{{ item.total }}</h2>
            <p class="card-text">{{ titleState(item.type) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardInfoStateValoration",
  props:['countDataStateValoration'],
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
          return 'Pend. Enviar Tratamiento'
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
    }
  }
}
</script>

<style scoped>

</style>
