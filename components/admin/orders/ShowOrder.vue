<template>

  <section class="invoice-preview-wrapper px-3 py-1">
    <div class="row invoice-preview">
      <!-- Invoice -->
      <div class="col-12">
        <div class="card invoice-preview-card shadow-none">
          <div class="card-body invoice-padding pb-0">
            <!-- Header starts -->
            <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
              <div>
                <div class="logo-wrapper mb-2">
                  <img width="140" class="text-center" :src="require(`~/assets/img/logo_saludwom.png`)" alt="saludwom">
                </div>
                <p class="card-text mb-25 font-weight-bold">SaludWoM</p>
                <p class="card-text mb-25">Barcelona - España</p>
                <p class="card-text mb-0">info@saludwom.com</p>
                <p class="card-text mb-0">+34 640847 411 - España</p>
              </div>
              <div class="mt-md-0 mt-2">
                <h4 class="invoice-title">
                  Orden de Compra
                  <span class="invoice-number font-weight-bold">#{{ order.orden_id }}</span>
                </h4>
                <div class="invoice-date-wrapper d-flex">
                  <p class="invoice-date-title mr-1">Fecha: </p>
                  <p class="invoice-date font-weight-bold">
                    {{ this.$moment(order.orden_created_at).format('DD MMMM YYYY') }}</p>
                </div>
                <span :class="`badge bg-${colorState(order.orden_state)}`">{{ textState(order.orden_state) }}</span>
              </div>
            </div>
            <!-- Header ends -->
          </div>

          <hr class="invoice-spacing"/>

          <!-- Address and Contact starts -->
          <div class="card-body invoice-padding pt-0">
            <div class="row invoice-spacing">
              <div class="col-xl-8 p-0">
                <h6 class="mb-2">Cliente:</h6>
                <h6 class="mb-25 font-weight-bold">{{ order.orden_patient_user_name }}</h6>
                <p class="card-text mb-25">{{ order.orden_patient_email }}</p>
                <p class="card-text mb-25">{{ order.orden_patient_phone }}</p>
              </div>
              <div class="col-xl-4 p-0 mt-xl-0 mt-2">
                <h6 class="mb-2">Información del Pago:</h6>
                <table>
                  <tbody>
                  <tr>
                    <td class="pr-1">Total:</td>
                    <td><span class="font-weight-bold">{{ (order.orden_price.value).toFixed(2) + '€' }}</span></td>
                  </tr>
                  <tr>
                    <td class="pr-1">Método de Pago: </td>
                    <td class="font-weight-bold text-primary" v-if="order.orden_subscription_name">{{ order.orden_subscription_name }}</td>
                    <td class="font-weight-bold" v-else> Stripe</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Address and Contact ends -->

          <!-- Invoice Description starts -->
          <div class="table-responsive">
            <table class="table">
              <thead>
              <tr>
                <th class="py-1">Descripción</th>
                <th class="py-1">Descuento</th>
                <th class="py-1">Total</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="py-1 w-100">
                  <p>
                    <strong>{{ order.orden_plan_name }}</strong> {{ order.orden_plan_description }}
                  </p>
                </td>
                <td class="py-1">
                  <span class="font-weight-bold">
                    {{ order.orden_discount ? (order.orden_discount.value).toFixed(2) + '€' : '0.00 €' }}
                  </span>
                </td>
                <td class="py-1">
                  <span class="font-weight-bold">
                    {{ (order.orden_price.value).toFixed(2) + '€' }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!--          <div class="card-body invoice-padding pb-0">-->
          <!--            <div class="row invoice-sales-total-wrapper">-->
          <!--              <div class="col-md-6 order-md-1 order-2 mt-md-0 mt-3">-->
          <!--                <p class="card-text mb-0">-->
          <!--                  <span class="font-weight-bold">Salesperson:</span> <span class="ml-75">Alfie Solomons</span>-->
          <!--                </p>-->
          <!--              </div>-->
          <!--              <div class="col-md-6 d-flex justify-content-end order-md-2 order-1">-->
          <!--                <div class="invoice-total-wrapper">-->
          <!--                  <div class="invoice-total-item">-->
          <!--                    <p class="invoice-total-title">Subtotal:</p>-->
          <!--                    <p class="invoice-total-amount">$1800</p>-->
          <!--                  </div>-->
          <!--                  <div class="invoice-total-item">-->
          <!--                    <p class="invoice-total-title">Discount:</p>-->
          <!--                    <p class="invoice-total-amount">$28</p>-->
          <!--                  </div>-->
          <!--                  <div class="invoice-total-item">-->
          <!--                    <p class="invoice-total-title">Tax:</p>-->
          <!--                    <p class="invoice-total-amount">21%</p>-->
          <!--                  </div>-->
          <!--                  <hr class="my-50" />-->
          <!--                  <div class="invoice-total-item">-->
          <!--                    <p class="invoice-total-title">Total:</p>-->
          <!--                    <p class="invoice-total-amount">$1690</p>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <!-- Invoice Description ends -->

          <hr class="invoice-spacing"/>

          <!-- Invoice Note starts -->
          <div class="card-body invoice-padding pt-0" v-if="order.orden_subscription_name">
            <div class="row">
              <div class="col-12">
                <span class="font-weight-bold">Nota:</span>
                <span>Este pago ha sido realizado de manera <strong class="text-primary">MANUAL</strong></span>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-primary" @click="closeModal">Cerrar</button>
          </div>
          <!-- Invoice Note ends -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ShowOrder",
  props: ['order'],
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    textState(state) {
      switch (state) {
        case '1':
          return 'Pendiente'
        case '2':
          return 'Cancelado'
        case '3':
          return 'Rechazado'
        case '4':
          return 'Aceptado'
      }
    },
    colorState(state) {
      switch (state) {
        case '1':
          return 'warning'
        case '2':
          return 'danger'
        case '3':
          return 'danger'
        case '4':
          return 'success'
      }
    }
  }
}
</script>


<style scoped>

</style>
