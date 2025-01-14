<template>
  <div>
    <div class="d-flex justify-content-between px-5 pt-3">
      <div>
        <h3 class="m-0">{{ coupon.name }}</h3>
      </div>
      <div>
        <span :class="`badge bg-${coupon.state == '1' ? 'success' : 'danger'} cursor-pointer`"
              @click="changeStatus">{{ coupon.state == '1' ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>

    <div class="px-5 py-3">
      <div class="row">
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Nombre o código de cupón:</label>
          <p>{{ coupon.name }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Descuento:</label>
          <p>{{ coupon.discount }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Límite de uso por usuario:</label>
          <p>{{ coupon.limit_use_per_user }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Límite de uso por cupón:</label>
          <p>{{ coupon.limit_use_per_coupon }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Fecha de expiración:</label>
          <p>{{ this.$moment(coupon.date_expiration).format('DD MMMM YYYY hh:mm') }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6" v-if="coupon.except_plans">
          <label class="form-label font-weight-bold" for="first-name-column">Planes Exceptos:</label>
          <p>{{

              JSON.parse(coupon.except_plans).map(item => {
                return item.name
              }).join(', ')

            }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label class="form-label font-weight-bold" for="first-name-column">Descripción:</label>
          <p class="text-justify">{{ coupon.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowCoupon",
  props: ['coupon'],
  methods: {
    changeStatus() {
      this.$swal.fire(
        {
          title: `Esta seguro ${this.coupon.state == '1' ? '<strong>Inactivar</strong>.' : '<strong>Activar.</strong>'} `,
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'No',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary mr-2'
          },

          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async result => {
        if (result.value) {

          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })

          this.$axios.post(`/api/v1/change-status-coupon/${this.coupon.id}`).then(resp => {
            console.log(resp)
            this.coupon.state = resp.data.data.state
            this.$toast.success('El estado se actualizó correctamente.')
          }).catch(e => {

            console.log(e)
            this.$toast.error('Error al actualizar el estado. Consulte con soporte SaludWom.')

          }).finally(() => { this.$vs.loading.close()})
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
