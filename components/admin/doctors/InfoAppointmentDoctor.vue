<template>
  <div class="p-3">
    <h4>Información del Paciente</h4>
    <div class="row">
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Nombre:</label>
          <p>{{ valuation.patient.user.name }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Apellidos:</label>
          <p>{{ valuation.patient.user.last_name }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Correo electrónico:</label>
          <p>{{ valuation.patient.user.email }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Teléfono:</label>
          <p>{{ valuation.patient.user.phone }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Edad:</label>
          <p>{{ valuation.patient.user.age }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Género:</label>
          <p>{{ valuation.patient.gender.name }}</p>
        </div>
      </div>
    </div>
    <hr>
    <div class="d-flex justify-content-between">
      <div>
        <h4>Información del Objetivo</h4>
      </div>
      <div>
        <span :class="`badge bg-${titleStateColor(valuation.state)}`">{{ titleState(valuation.state) }}</span>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Nombre del Objetivo:</label>
          <p>{{ valuation.name }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Tratamiento:</label>
          <p>{{ valuation.treatment.treatment }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-4">
        <div class="mb-1">
          <label class="form-label">Suscripción:</label>
          <p>{{ valuation.subscription.plan.name }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <label class="form-label">Descripción del Objetivo:</label>
        <p>{{ valuation.objectives }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoAppointmentDoctor",
  props: ['valuation'],
  methods:{
    titleState(state) {
      switch (state) {
        case '1':
          return 'Pend. Enviar Recursos'
        case '2':
          return 'Recursos Enviados'
        case '3':
          return 'Pend. Enviar Tratamiento'
        case '4':
          return 'En Tratamiento'
        case '5':
          return 'Finalizado'
      }
    },
    titleStateColor(state) {
      switch (state) {
        case '1':
          return 'warning'
        case '2':
          return 'info'
        case '3':
          return 'danger'
        case '4':
          return 'primary'
        case '5':
          return 'success'
      }
    }
  }
}
</script>

<style scoped>

</style>
