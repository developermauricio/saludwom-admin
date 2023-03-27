<template>
  <div class="app-content content questionnaire">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row">
        <div class="content-header-left">
          <div class="row breadcrumbs-top">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <h1 class="content-header-title  mb-0">Cuestionarios</h1>
            <!--  Botón agregar cuestionario   -->
                <button @click="openModalAddQ" class="btn btn-primary">Agregar Cuestionario <i
                  v-html="$feathericons['plus'].toSvg()"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-body">
        <!--=====================================
                LISTA DE CUESTIONARIOS
         ======================================-->
        <TableQuestionnaire/>
      </div>
    </div>

    <!--=====================================
        MODAL AGREGAR CUESTIONARIO
    ======================================-->
    <vs-popup class="questionnaire" title="Agregar Cuestionario" :active.sync="openModalAddQuestionaire">
      <ModalAddQuestionnaire ref="modalAddQ"/>
    </vs-popup>
  </div>
</template>

<script>
import ModalAddQuestionnaire from "../../../components/questionnaire/ModalAddQuestionnaire";
export default {
  name: "Questionnaires",
  data() {
    return {
      openModalAddQuestionaire: false
    }
  },
  methods: {
    openModalAddQ() {
      this.$FModal.show(
        {
          component: ModalAddQuestionnaire,
          clickToClose: false,
          escToClose: false,
          placement: 'center center',
        },
      )
      // this.openModalAddQuestionaire = true
    }
  }
}
</script>

<style scoped>

</style>
