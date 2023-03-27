// export const namespaced = true
export const state = () => ({
  questionnaire: {
    name: '',
    description: '',
    treatments: [],
    questions: []
  },
})
export const mutations = {
  //Agregar las preguntas al cuestionario
  SET_ADD_QUESTIONS(state, payload) {
    state.questionnaire.questions = [...state.questionnaire.questions, payload]
  },
  //Agregar el nombre del cuestionario
  SET_NAME_QUESTIONNAIRE(state, payload) {
    state.questionnaire.name = payload
  },
  //Agregar la descripción del cuestionario
  SET_DESCRIPTION_QUESTIONNAIRE(state, payload) {
    state.questionnaire.description = payload
  },
  //Agregar la descripción del cuestionario
  SET_TREATMENT_QUESTIONNAIRE(state, payload) {
    state.questionnaire.treatments = payload
  },
  //Limpiar el cuestionario cuando de clic en cancelar
  CLEAR_QUESTIONNAIRE(state) {
    state.questionnaire = {
      name: '',
      description: '',
      questions: [],
      treatments: []
    }
  }
}
export const getters = {
  listQuestions(state) {
    return state.questionnaire.questions
  }
}
export const actions = {
  ACTION_CLEAR_DATA_QUESTIONNAIRE({commit}) {
    commit('CLEAR_QUESTIONNAIRE')
  }
}


