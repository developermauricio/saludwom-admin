<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row">
        <div class="content-header-left mb-2">
          <div class="breadcrumbs-top d-flex align-items-center justify-content-between">
        <!--   Titulo de la Página o Módulo   -->
            <div>
              <h1 class="content-header-title  mb-0">Detalle Objetivo</h1>
            </div>
        <!--   Botones   -->
            <div>
              <button class="btn btn-primary btn-sm mr-4">Asignar Recursos</button>
<!--              <button class="btn btn-warning mr-4">Asignar Tratamiento</button>-->
<!--              <button class="btn btn-info mr-4">Informe Médico</button>-->
<!--              <button class="btn btn-success ">Finalizar Tratamiento</button>-->
            </div>
          </div>
        </div>
      </div>
      <div class="content-body">
      <!--    Sección detalle del paciente y objetivo    -->
        <div>
          <SectionDetailValoration :valuation.sync="valuation"/>
        </div>
        <!--    Sección tabs    -->
        <div>
          <vs-tabs color="#D85C72" alignment="fixed" class="tabs-objective">
            <vs-tab label="Objetivo">
              <div class="pt-2">
                <Information :valuation="valuation"/>
              </div>
            </vs-tab>
            <vs-tab label="Recursos">
              <div>
                <h2>Recursos</h2>
              </div>
            </vs-tab>
            <vs-tab label="Tratamiento">
              <div>
                <h2>Tratamiento</h2>
              </div>
            </vs-tab>
          </vs-tabs>
        </div>
      </div>
      <!-- Chat Boton Flotante-->
      <ChatValoration :valuation="valuation" :chatChannel="valuation.chat" v-if="valuation.subscription.plan_id === 1"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowValoration",
  data(){
    return{
      valuation: {
        doctor:{user:{}},
        patient:{
          user:{country:{}},
          gender:{}
        },
        treatment: {treatment:null},
        subscription: {plan: {name: null, description: null}}
      }
    }
  },
  methods:{
    getValuation() {
      const params = this.$route.params
      this.$axios.get(`/api/v1/get-valuation/${params.slug}`).then(resp => {
        this.valuation = resp.data.data
        this.$vs.loading.close()
      }).catch((e) => {
        console.log('ERROR', e);
        this.$toast.error("Error al obtener el objetivo. Consulte a soporte SaludWom");
        this.$vs.loading.close()
      })
    }
  },
  mounted() {
    this.getValuation()
  }
}
</script>

<style scoped>

</style>
