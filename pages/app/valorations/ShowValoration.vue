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
            <div v-if="$auth.user.roles[0].name === 'Doctor'">
              <button class="btn btn-primary btn-sm mr-4" @click="addResources()">Asignar Recursos</button>
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
          <vs-tabs :value="valueTabPosition" color="#D85C72" alignment="fixed" class="tabs-objective">
            <vs-tab label="Objetivo">
              <div class="pt-2">
                <Information :valuation="valuation"/>
              </div>
            </vs-tab>
            <vs-tab label="Recursos">
              <div class="pt-2">
                <Resources :valuation="valuation"></Resources>
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
      <!-- Chat Boton Flotante SOLO PARA EL PLAN ESMERALDA Y DIAMANTE-->
      <ChatValoration :valuation="valuation" :chatChannel="valuation.chat" v-if="valuation.subscription.plan_id === 1 || valuation.subscription.plan_id === 2"/>
    </div>
  </div>
</template>

<script>
import ModalAddResources from "../../../components/valoration/resources/ModalAddResources";
import {bus} from "../../../plugins/bus";
import Resources from "../../../components/valoration/Resources";

export default {
  name: "ShowValoration",
  components: {Resources},
  data(){
    return{
      valueTabPosition: 0,
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
    /* Agregar recursos*/
    addResources(){
      this.$FModal.show(
        {
          component: ModalAddResources,
          clickToClose: false,
          escToClose: false,
          placement: 'center center',
        },
        {
          valoration: this.valuation
        }
      )
    },
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
    bus.$on('tabResources', (data) =>{
      this.valueTabPosition = data
    })
    this.getValuation()
  }
}
</script>

<style scoped>

</style>
