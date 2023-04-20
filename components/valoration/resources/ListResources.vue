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
        <p><span class="font-weight-bold">2.</span> Selecciona uno o varios cuestionarios. <span class="text-danger">*</span></p>
        <Questionnaires/>
      </div>

      <!--=====================================
       LISTA DE RECURSOS DE VIDEO
     ======================================-->
      <div class="mt-2">
        <p><span class="font-weight-bold">3.</span> Selecciona uno o varios videos. <span class="text-danger">*</span></p>
        <ResourcesVideos/>
      </div>
      <hr>
      <!--=====================================
       MENSAJE DEL DOCTOR
     ======================================-->
      <div class="mt-2">
        <p>Deja un mensaje o un descripción de este recurso.</p>
        <textarea
          v-model="$store.state.resources.resources.description"
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="4"
          placeholder="Mensaje..">
        </textarea>
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
