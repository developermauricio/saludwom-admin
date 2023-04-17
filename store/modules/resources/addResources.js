export const state = () => ({
  resources: {
    valuation: null,
    touchData: false,
    selectedQuestionnaires: []
  },
})

export const mutations = {
  SET_VALORATION(state, data) {
    state.resources.valuation = data

  },
  SET_TOUCH_DATA(state, data) {
    state.resources.touchData = data

  },
  SET_SELECTED_QUESTIONNAIRE(state, question){
    const indexQuestion = state.resources.selectedQuestionnaires.findIndex((item) =>{return item.id === question.id})
    if (indexQuestion !== -1) {
      state.resources.selectedQuestionnaires.splice(indexQuestion, 1)
    } else {
      state.resources.selectedQuestionnaires.push(question)
    }
  },
  CLEAR_SELECTED_QUESTION (state) {
    state.resources.selectedQuestionnaires = []
  }
}
// export const getters = {}
export const actions = {
  assignValoration({commit, state}, data) {
    commit('SET_VALORATION', data)
  },
  assignTouchData({commit, state}, data) {
    commit('SET_TOUCH_DATA', data)
  },
  selectedQuestionnaire({commit, state}, question) {
    const selectedIndex = state.resources.selectedQuestionnaires.indexOf(question)
    if (selectedIndex === -1) {
      commit('SET_SELECTED_QUESTIONNAIRE', question)
    } else {
      commit('SET_REMOVE_SELECTED_QUESTIONNAIRE', selectedIndex)
    }
  },
  isSelectedQuestionnaire({commit, state}, question) {
    // state.resources.selectedQuestionnaires.map(item=>{
    //   if (item.id === question.id){
    //     console.log('entro')
    //     return 'selected'
    //   }else{
    //     return ''
    //   }
    // })
    // return 'selected'
    // console.log(question)
    // console.log(state.resources.selectedQuestionnaires)
      return state.resources.selectedQuestionnaires.includes(question)
  }
}
