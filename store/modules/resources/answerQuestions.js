import Vue from 'vue'

export const state = () => ({
  questions: []
})

export const mutations = {
  SET_QUESTIONS(state, data){
    if (data.length > 0){
      state.questions = data
    }
  },
}

export const getters = {

}

export const actions = {
  async answerQuestionsPatient({commit, state}, data) {
    try {
      const response = await this.$axios.get(`/api/v1/get-answer-resources/${JSON.stringify(data)}`)
      commit('SET_QUESTIONS', response.data.data)
      return response
    } catch (error) {
      console.log(error)
      return false
    }
  },
}
