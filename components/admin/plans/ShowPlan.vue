<template>
  <div>
    <div class="d-flex justify-content-between px-5 pt-3">
      <div>
        <h3 class="m-0">{{ plan.name }}</h3>
      </div>
      <div>
        <span :class="`badge bg-${plan.state == '1' ? 'success' : 'danger'} cursor-pointer`">{{ plan.state == '1' ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>

    <div class="px-5 py-2">
      <div class="row">
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Plan:</label>
          <p>{{ plan.name }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Precio:</label>
          <p class="text-primary">{{ plan.price }}€</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Periodo:</label>
          <p>{{ textPeriod(plan.period )}}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Numero de Citas:</label>
          <p>{{ plan.number_appointments }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Intervalo de citas en días:</label>
          <p>{{ plan.time_interval_appointments }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Fecha de Registro:</label>
          <p>{{ plan.created_at_format }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Última actualización:</label>
          <p>{{ plan.update_at_format }}</p>
        </div>

        <div class="col-lg-4 col-md-4 col-12" v-if="plan && plan.image_background">
          <div class="mb-1">
            <label class="form-label font-weight-bold" for="first-name-column">Imagen de fondo:</label><br>
            <img :src="imageBackg(plan.image_background)" alt="" width="100">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label class="form-label font-weight-bold" for="first-name-column">Descripción:</label>
          <p>{{ plan.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowPlan",
  props:['plan'],
  methods:{
    imageBackg(img){
      if (img.includes('storage') || img.includes('assets')){

        return `${this.$config.urlBack}${img}`
      }
      return img
    },

    textPeriod(period){

      switch (period) {
        case 'week':
          return 'Semana'
        case 'month':
          return 'Mes'
        case 'year':
          return 'Año'
      }
    }
  }
}
</script>

<style scoped>

</style>
