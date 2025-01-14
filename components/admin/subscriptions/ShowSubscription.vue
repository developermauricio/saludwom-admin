<template>
  <div>
    <div class="d-flex justify-content-between px-5 pt-3">
      <div>
        <h3 class="m-0">Información Suscripción</h3>
      </div>
      <div>
        <span :class="`badge bg- cursor-pointer`">
        </span>
      </div>
    </div>
    <pre>
      {{ subscription }}
    </pre>
    <div class="px-5 py-2">
      <div class="row">
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Plan:</label>
          <p>{{ subscription.subscription_plan_name }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Precio:</label>
          <p>{{  (subscription.subscription_price).toFixed(2) + '€' }}</p>
        </div>
        <div class="col-12 col-lg-4 col-md-4">
          <label class="form-label font-weight-bold" for="first-name-column">Periodo:</label>
          <p>{{ period(subscription.subscription_period) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowSubscription",
  props: ['subscription'],
  methods:{
    period(period){
      switch (period) {
        case 'week':
          return 'Semana'
        case 'month':
          return 'Més'
        case 'year':
          return 'Año'
          break;
      }
    }
  }
}
</script>


<style scoped>

</style>
