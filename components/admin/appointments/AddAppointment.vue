<template>
  <div>
    <div class="p-3">
      <h3>Agregar Cita</h3>
            <FormAppointment :appointment="null" ref="formAppointment"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="addAppointment">Agregar Cita</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddAppointment",
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    addAppointment(){

    }
  }
}
</script>

<style scoped>

</style>
