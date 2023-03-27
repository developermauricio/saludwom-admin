<template>
  <div>
    <!--=====================================
		   DETALLE DEL OBJETIVO
    ======================================-->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
              <div>
                <h4>Detalle del Objetivo 🚀.</h4>
              </div>
              <div>
                <span :class="`badge bg-${titleStateColor(valuation.state)}`">{{ titleState(valuation.state) }}</span>
              </div>
          </div>
          <div class="card-body">
          <!--  Datos generales del objetivo   -->
            <div class="row">
          <!--  Nombre del objetivo  -->
              <div class="col-12 col-md-4 col-lg-4">
                <div class="form-group">
                  <label class="font-weight-bold">Nombre del objetivo:</label>
                  <p>{{ valuation.name }}</p>
                </div>
              </div>
              <!--  Tipo de tratamiento  -->
              <div class="col-12 col-md-4 col-lg-4">
                <div class="form-group">
                  <label class="font-weight-bold">Tratamiento:</label>
                  <p>{{ valuation.treatment.treatment }}</p>
                </div>
              </div>
              <!--  Fecha de Registro  -->
              <div class="col-12 col-md-4 col-lg-4">
                <div class="form-group">
                  <label class="font-weight-bold">Fecha de Registro:</label>
                  <p>{{ $moment(valuation.created_at ).tz(this.timezoneUser).format('DD MMMM YYYY') }}</p>
                </div>
              </div>
            </div>
            <!--  Descripción del objetivo  -->
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label class="font-weight-bold">Descripción del Objetivo:</label>
                  <p class="text-justify">{{ valuation.objectives }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--=====================================
		       ARCHIVOS & CITAS & SUSCRIPCIÓN
    ======================================-->
    <div class="row">
      <!--=====================================
          ARCHIVOS
      ======================================-->
      <div class="col-12 col-md-6 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h4>Documentos o archivos adjuntos 📎.</h4>
          </div>
          <div class="card-body px-1">
            <Archives :archives="valuation.archives"/>
          </div>
        </div>
      </div>
      <!--=====================================
          CITAS
       ======================================-->
      <div class="col-12 col-md-6 col-lg-6" v-if="valuation.subscription.plan_id !== 1">
        <div class="card">
          <div class="card-header">
            <h4>Citas 🗓.</h4>
          </div>
          <div class="card-body">
              <Appointments :appointments="valuation.appointments"/>
          </div>
        </div>
      </div>
      <!--=====================================
          SUSCRIPCIÓN
       ======================================-->
      <div class="col-12 col-md-6 col-lg-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <div>
              <h4>Suscripción para este objetivo 🔥.</h4>
            </div>
            <div>
              <div>
                <span :class="`badge bg-${ stateColorSubs(valuation.subscription.state)} ms-2 text-white`">{{
                    stateTitleSubs(valuation.subscription.state)
                  }}</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <InfoSubscription :subscription="valuation.subscription"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "Information",
  data(){
    return{
      timezoneUser: null,
    }
  },
  props:['valuation'],
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
    },
    stateColorSubs(state) {
      switch (state) {
        case '1':
          return 'warning'
        case '2':
          return 'danger'
        case '3':
          return 'danger'
        case '4':
          return 'success'
        case '5':
          return 'info'
      }
    },
    stateTitleSubs(state) {
      switch (state) {
        case '1':
          return 'Pendiente'
        case '2':
          return 'Cancelada'
        case '3':
          return 'Rechazado'
        case '4':
          return 'Activa'
        case '5':
          return 'Completada'
      }
    },
  },
  created() {
    this.timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone
  },
}
</script>

<style scoped>

</style>
