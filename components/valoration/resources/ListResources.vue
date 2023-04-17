<template>
  <div>
    <div>
      <h4>Lista de Recursos</h4>
      <!--=====================================
        ASIGNAR O PERMITIR DATOS TÁCTILES
      ======================================-->
      <!--  Input TOOGLE   -->
      <div class="mt-4">
        <p><span class="font-weight-bold">1.</span>Permitir datos táctiles.</p>
        <div class="form-check form-switch">
          <input class="form-check-input" v-model="$store.state.resources.resources.touchData" id="flexSwitchCheckChecked" type="checkbox">
          <label class="form-check-label"
                 for="flexSwitchCheckChecked">{{ $store.state.resources.resources.touchData ? 'Permitir' : 'No Permitir' }}</label>
        </div>
      </div>

      <!--=====================================
        LISTA DE CUESTIONARIOS
      ======================================-->
      <div class="mt-4">
        <p><span class="font-weight-bold">2.</span> Selecciona uno o varios cuestionarios.</p>
        <Questionnaires/>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "ListResources",
  data() {
    return {
      touchData: false,
    }
  },
  watch: {
    'touchData': function (val) {
      this.$store.dispatch('assignTouchData', val)
    }
  }
}
</script>

<style scoped>

</style>
