<template>
  <div class="row resources-questionnaires">
    <div class="d-flex mb-2">
      <div class="w-50">
        <label for="">Buscar Cuestionario:</label>
        <input v-model="valueSearchQuestionnaire" type="text" placeholder="Buscar..." class="form-control">
      </div>

    </div>
    <div class="col-12 col-md-4 col-lg-4" v-for="(questionnaire, index) in questionnairesFilter" :key="index">
      <div :class="{ selected: isSelected(questionnaire) }" class="card item-questionnaire">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 @click="selectQuestionnaire(questionnaire)" style="cursor:pointer;">{{ questionnaire.name | truncate(2) }}</h5>
          <a href="#" @click="showQuestionnaire(questionnaire)">Ver cuestionario</a>
        </div>
<!--        <div class="card-body">-->
<!--          Tags:-->
<!--          <div v-for="(treatment, index) in questionnaire.treatments" :key="index">-->
<!--&lt;!&ndash;            <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>&ndash;&gt;-->
<!--            <ul class="m-0">-->
<!--              <li>-->
<!--                <p class="font-italic text-muted m-0" style="font-size: 12px">{{ treatment.treatment }}. </p>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>

</template>

<script>
import ModalUpdateQuestionnaire from "../../questionnaire/ModalUpdateQuestionnaire";
import {mapState} from 'vuex'

export default {
  name: "Questionnaires",
  data() {
    return {
      questionnaires: [],

      valueSearchQuestionnaire: '',
      valueTreatment: '',
      messageIsQuestionnaires: false
    }
  },

  computed: {
    ...mapState(['resources']),
    isSelected() {
      return questionnaire => this.resources.resources.selectedQuestionnaires.find((item) =>{return questionnaire.id === item.id})
    },
    questionnairesFilter() {
      if (this.valueSearchQuestionnaire) {
        return this.questionnaires.filter(questionnaire => questionnaire.name.toLowerCase().includes(this.valueSearchQuestionnaire.toLowerCase()))
      }
      return this.questionnaires
    }
  },
  methods: {
    selectQuestionnaire(questionnaire){
      this.$store.commit('SET_SELECTED_QUESTIONNAIRE', questionnaire)
    },
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
    // isSelected(index) {
    //   const question = this.questionnaires[index]
    //   return this.$store.dispatch('isSelectedQuestionnaire',question)
    //   // return this.$store.state.resources.resources.selectedQuestionnaires.includes(question)
    // },
    getQuestionnaire() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      this.$axios.get(`/api/v1/get-questionnaires/?treatmentId=${this.valueTreatment}`).then(resp => {
        console.log('DATA CUESTIONARIOS ', resp.data.data)
        resp.data.data.forEach(item => {
          if (item.state === "1"){
            this.questionnaires.push(item)
          }
        })
        // this.questionnaires = resp.data.data
        this.$vs.loading.close()
        if (this.questionnaires.length === 0) {
          return this.messageIsQuestionnaires = true
        }

      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Al obtener los cuestionarios. Consulte a soporte SaludWom.");
      })
    },
  },
  mounted() {
    this.getQuestionnaire()
  }
}
</script>

<style scoped>

</style>
