<template>
  <div>
    <div class="d-flex justify-content-between px-5 pt-3">
      <div>
        <h3 class="m-0">{{ specialty.treatment }}</h3>
      </div>
      <div>
        <span :class="`badge bg-${specialty.state == '1' ? 'success' : 'danger'} cursor-pointer`"
              @click="changeStatus">{{ specialty.state == '1' ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>

    <div class="px-5 py-3">
      <div class="row">
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Especialidad:</label>
          <p>{{ specialty.treatment }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Fecha de Registro:</label>
          <p>{{ this.$moment(specialty.created_at).format('DD MMMM YYYY') }}</p>
        </div>

        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Fecha de Última Actualización:</label>
          <p>{{ this.$moment(specialty.updated_at).format('DD MMMM YYYY') }}</p>
        </div>
        <div class="col-12 col-lg-6 col-md-6">
          <label class="form-label font-weight-bold" for="first-name-column">Categorías:</label>
          <p>{{

              specialty.categories.map(item => {
                return item.name
              }).join(', ')

            }}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label class="form-label font-weight-bold" for="first-name-column">Descripción:</label>
          <p class="text-justify">{{ specialty.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowSpecialty",
  props: ['specialty'],
  methods: {
    changeStatus(){
      this.$swal.fire(
        {
          title: `Esta seguro ${this.specialty.state == '1' ? '<strong>Inactivar</strong>. Verifique que esta especialidad no esta asignada a un especialista.' : '<strong>Activar</strong>'} `,
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

          this.$axios.post(`/api/v1/change-status-treatment/${this.specialty.id}`).then(resp => {
            this.specialty.state = resp.data.data.state
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
