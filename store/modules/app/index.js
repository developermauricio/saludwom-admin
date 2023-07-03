// export const namespaced = true
export const state = () => ({
  questionnaire: {
    name: '',
    description: '',
    solved: Boolean,
    treatments: [],
    deleteTreatments: [],
    questions: [],
    removeQuestions: [],
  },
})
export const mutations = {
  //Agregar las preguntas al cuestionario
  SET_ADD_QUESTIONS(state, payload) {

    state.questionnaire.questions = [...state.questionnaire.questions, payload]
  },
  SED_ADD_DELETE_TREATMENTS_IN_QUESTIONNAIRE(state, payload){
    if (state.questionnaire.deleteTreatments && typeof state.questionnaire.deleteTreatments[Symbol.iterator] === 'function') {
      state.questionnaire.deleteTreatments = [...state.questionnaire.deleteTreatments, payload]
    } else {
      state.questionnaire.deleteTreatments = [payload]
    }
  },
  //Remueve las preguntas al cuestionario
  SET_REMOVE_QUESTIONS(state, payload) {
    if (payload.id){
      state.questionnaire.removeQuestions = [...state.questionnaire.removeQuestions, payload]
    }
  },
  //Agregar el nombre del cuestionario
  SET_NAME_QUESTIONNAIRE(state, payload) {
    state.questionnaire.name = payload
  },
  //Agregar la descripción del cuestionario
  SET_DESCRIPTION_QUESTIONNAIRE(state, payload) {
    state.questionnaire.description = payload
  },
  //Agregar el estado resuelt del cuestionario
  SET_SOLVED_QUESTIONNAIRE(state, payload) {
    state.questionnaire.solved = payload
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
      treatments: [],
      removeQuestions: [],
      deleteTreatments: [],
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


