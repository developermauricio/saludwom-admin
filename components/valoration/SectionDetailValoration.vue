<template>
  <div>
    <div class="row">
      <div class="col-12 col-lg-7 col-md-7">
        <div class="card">
          <div class="card-header d-flex justify-content-between ">
            <div>
              <h4>Info Paciente.</h4>
            </div>
            <div>
              <span class="badge bg-success">Activo</span>
            </div>
          </div>
          <div class="card-body">
            <!--    -->
            <div class="d-flex">
              <!--   Foto de Perfil  -->
              <div>
                <img class="img-fluid rounded mb-2" v-if="valuation.patient.user.picture"
                     :src="`${$config.urlBack}${valuation.patient.user.picture}`" height="100" width="100" alt="SaludWom">
                <img class="img-fluid rounded mb-2" v-else src="@/assets/img/user-profile.png" height="100" width="100"
                     alt="SaludWom">
              </div>
              <!--  Datos del paciente -->
              <div class="px-2">
                <div class="d-flex">
                  <h4 class="font-weight-bold">{{ valuation.patient.user.name }} {{
                      valuation.patient.user.last_name
                    }}
                  </h4>
                  <vs-tooltip v-if="valuation.patient.user.country" :text="valuation.patient.user.country.name "
                              position="left" style="cursor:pointer">
                    <img class="mx-1" width="20" :src=valuation.patient.user.country_flag alt=""/>
                  </vs-tooltip>
                </div>

                <h6 class="text-body-heading">Documento. <span
                  class="font-weight-bold">{{ valuation.patient.user.document }}</span></h6>
                <h6 class="text-body-heading">Edad. <span class="font-weight-bold">{{
                    valuation.patient.user.age
                  }} años</span></h6>
                <span class="badge bg-light-primary">Género. {{ valuation.patient.gender.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5 col-md-5">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <div>
              <h4>Info Objetivo.</h4>
            </div>
            <div>
              <span :class="`badge bg-${titleStateColor(valuation.state)}`">{{ titleState(valuation.state) }}</span>
            </div>
          </div>
          <div class="card-body">
            <!--    Nombre del tratamiento   -->
            <div>
              <h4 class="font-weight-bold">{{ valuation.name }}</h4>
              <h6 class="text-body-heading">Fecha de Registro.
                <span class="font-weight-bold">{{ $moment(valuation.created_at ).tz(this.timezoneUser).format('DD MMMM YYYY') }}</span>
              </h6>
              <h6 class="text-body-heading">Especialista.
                <span class="font-weight-bold">{{ valuation.doctor.user.name }} {{
                    valuation.doctor.user.last_name
                  }}</span>
              </h6>
              <h6 class="text-body-heading">Suscripción.
                <span class="font-weight-bold">{{ valuation.subscription.plan.name }}</span>
              </h6>
              <vs-tooltip :text="valuation.treatment.description" position="bottom">
                <span class="badge bg-light-primary">Tratamiento de {{ valuation.treatment.treatment }}</span>
              </vs-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SectionDetailValoration",
  data(){
    return{
      timezoneUser: null,
    }
  },
  props: ['valuation'],
  methods: {
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
  },
  created() {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (userTimeZone) {
        this.timezoneUser = userTimeZone;
      } else {
        // Si no se pudo obtener la zona horaria del navegador, establecer una predeterminada
        this.timezoneUser = 'Europe/Madrid'; // Por ejemplo, configurar como UTC
      }
    } catch (error) {
      console.error('Error al obtener la zona horaria:', error);
      // En caso de un error, también puedes establecer una zona horaria predeterminada
      this.timezoneUser = 'Europe/Madrid';
    }
  },
}
</script>

<style scoped>

</style>
