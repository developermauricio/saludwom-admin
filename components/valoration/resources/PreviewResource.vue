<template>
  <div>
    <h4>Cuestionario</h4>

    <div>
      <!-- LOCALIZA TU DOLOR -->
      <div class="mt-2" v-if="$store.state.resources.resources.touchData">
        <p><span class="font-weight-bold"></span>Localiza tu dolor.</p>
        <div class="px-5 mt-2">
          <HumanBody/>
        </div>
      </div>
      <!-- CUESTIONARIOS -->
      <div class="row mt-2">
        <p><span class="font-weight-bold"></span>Resuelve {{ $store.state.resources.resources.selectedQuestionnaires.length > 1 ? 'los' : 'el' }} cuestionario{{ $store.state.resources.resources.selectedQuestionnaires.length > 1 ? 's' : '' }}.</p>
        <div class="col-12 col-md-6 col-lg-6"
             v-for="(questionnaire, index) in $store.state.resources.resources.selectedQuestionnaires" :key="index">
          <div class="card item-questionnaire">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 style="cursor:pointer;">{{ questionnaire.name }}</h5>
              <a href="#" @click="showQuestionnaire(questionnaire)">Ver cuestionario</a>
            </div>
            <div class="card-body">
              Tags:
              <div v-for="(treatment, index) in questionnaire.treatments" :key="index">
                <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModalUpdateQuestionnaire from "../../questionnaire/ModalUpdateQuestionnaire";

export default {
  name: "PreviewResource",
  methods: {
    showQuestionnaire(questionnaire) {
      this.$FModal.show(
        {
          component: ModalUpdateQuestionnaire,
          clickToClose: false,
          escToClose: false,
          placement: 'center center',
        },
        {
          questionnaire: questionnaire
        }
      )
    },
  }
}
</script>

<style scoped>

</style>
