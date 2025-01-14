<template>
  <div>
    <div class="mb-2">
      <div class="d-flex justify-content-between align-items-center">

        <div class="mr-2">
          <h3>Vista Preview</h3>
          <p>En este módulo, ordena tus planes arrastrando y soltando según tu preferencia, y se mostrarán en ese orden
            por defecto.</p>
        </div>

        <div>
          <button :disabled="disabledUpdate" class="btn btn-primary" @click="saveOrder">Actualizar</button>
        </div>

      </div>
    </div>

    <div class="row d-flex justify-content-center">
      <draggable
        @change="orderPlans()"
        :sort="true "
        tag="v-layout"
        :group="{ name: 'row' }"
        :list="plans" @start="dragging = true"
        class="row wrap justify-space-around">
        <v-flex class="col-12 col-md-3" v-for="plan in plans" :key="plan.id" v-if="plan.state === '1'">
          <div class="card basic-pricing card-plans cursor-move" :style="{ backgroundImage: `url(${imageBackg(plan.image_background)})` }">
            <div class="card-header d-flex justify-content-between">
              <span :class="`badge badge-${plan.state === '1' ? 'success': 'danger'}`">{{
                  plan.state === '1' ? 'Activo' : 'Inactivo'
                }}</span>
              <!-- Cambia "badge-success" a "badge-danger" para inactivo -->
            </div>
            <div class="card-body">
              <h3 class="text-white">{{ plan.name }}</h3>
              <h1 class="text-white font-weight-bold font-large-2">{{ (plan.price).toFixed(2) }}€</h1>
              <div class="mt-3">
                {{ plan.description }}
              </div>
              <button class="btn btn-block bg-warning mt-2 text-primary">¡Lo quiero!</button>
            </div>
          </div>
        </v-flex>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: "PlanPreview",
  components: {
    draggable
  },
  data() {
    return {
      plans: [],
      disabledUpdate: true,
    }
  },
  methods: {
    saveOrder() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })

      this.$axios.post('api/v1/update-order-plans', this.plans).then(resp =>{
        this.$toast.success("El orden se cambio exitosamente.");
      }).catch(e =>{
        console.log(e)
        this.$toast.error("Error al ordenar los planes. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },
    orderPlans() {
      this.disabledUpdate = false
    },
    getPlans() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })

      this.$axios.get('/api/v1/get-plans-order').then(resp => {
        this.plans = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los planes. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },
    imageBackg(img) {
      if (img.includes('storage') || img.includes('assets')) {

        return `${this.$config.urlBack}${img}`
      }
      return img
    },
  },
  mounted() {
    this.getPlans();
  }
}
</script>

<style scoped>

</style>
