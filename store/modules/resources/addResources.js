import Vue from 'vue'
export const state = () => ({
  resources: {
    valuation: null,
    touchData: false,
    selectedQuestionnaires: [],
    selectedResourceVideo: [],
    description: String(),
    doctor_id: null,
    patient_id: null,
  },
  listResources: [],
  dataLoading: false,
  questions: []
})

export const mutations = {
  notData(state) {
    state.dataLoading = true
  },
  SET_VALORATION(state, data) {
    state.resources.valuation = data

  },
  SET_LIST_RESOURCES(state, data) {
    if (data.length > 0) {
      state.listResources = data
      state.dataLoading = false
    } else {
      state.dataLoading = true
    }
  },
  SET_DOCTOR_ID(state, data) {
    state.resources.doctor_id = data
  },
  SET_PATIENT_ID(state, data) {
    state.resources.patient_id = data
  },
  SET_TOUCH_DATA(state, data) {
    state.resources.touchData = data

  },
  SET_SELECTED_QUESTIONNAIRE(state, question) {
    const indexQuestion = state.resources.selectedQuestionnaires.findIndex((item) => {
      return item.id === question.id
    })
    if (indexQuestion !== -1) {
      state.resources.selectedQuestionnaires.splice(indexQuestion, 1)
    } else {
      state.resources.selectedQuestionnaires.push(question)
    }
  },
  SET_SELECTED_RESOURCE_VIDEO(state, video) {
    const indexResource = state.resources.selectedResourceVideo.findIndex((item) => {
      return item.id === video.id
    })

    if (indexResource !== -1) {
      state.resources.selectedResourceVideo.splice(indexResource, 1)
    } else {
      state.resources.selectedResourceVideo.push(video)
    }
  },
  SET_QUESTIONS(state, data){
    if (data.length > 0){
      state.questions = data
    }
  },
  CLEAR_DATA(state) {
    state.resources.selectedQuestionnaires = []
    state.resources.valuation = null
    state.resources.touchData = false
    state.resources.selectedQuestionnaires = []
    state.resources.selectedResourceVideo = []
    state.resources.description = ''
    state.resources.doctor_id = null
    state.resources.patient_id = null
  }
}
export const getters = {
  // Devuelve la lista de juegos.
  listResources: state => state.listResources
}
// export const getters = {}
export const actions = {
  assignValoration({commit, state}, data) {
    commit('SET_VALORATION', data)
  },
  assignDoctorId({commit, state}, data) {
    commit('SET_DOCTOR_ID', data)
  },
  assignPatientId({commit, state}, data) {
    commit('SET_PATIENT_ID', data)
  },
  assignTouchData({commit, state}, data) {
    commit('SET_TOUCH_DATA', data)
  },
  clearData({commit, state}) {
    commit('CLEAR_DATA')
  },
  async deleteResource({commit, state}, resource){
    let resp
    try {
      console.log('entro aca')
      resp = await this.$axios.delete(
        '/api/v1/delete-resource-valoration',
        resource
      )

      if (resp.status === 200 || resp.status === 201) {
        return  Vue.prototype.$toast.success('Recurso Eliminado Correctamente');
      } else {
        return Vue.prototype.$toast.error('No se pudo eliminar el recurso');
      }

    } catch (e) {
      // this.$toast.error('Error al agregar el video.');
      console.log('ERROR', e)
      return Vue.prototype.$toast.error('Error al eliminar el recurso. Consulte con soporte SaludWom');
    }
  },
  async getResource({commit, state}, valuationId){
    try {
      const response = await this.$axios.get(`/api/v1/get-list-resources/${valuationId}`)
      console.log('DATA RESOURCE ', response)
      if (response && response.data.data && response.data.data.length > 0) {
        commit('SET_LIST_RESOURCES', response.data.data)
        return true
      } else {
        commit('notData')
        console.log('No se encontraron recursos')
        return false
      }
    } catch (error) {
      commit('notData')
      console.log(error)
      return false
    }
  },
  async addResource({commit, state}) {
    let errorMessage = ''
    let resp
    if (!state.resources.valuation) {
      errorMessage = 'La valoración es obligatoria. ';
    }
    if (state.resources.selectedQuestionnaires.length === 0) {
      errorMessage = 'Debe seleccionar al menos un cuestionario. ';
    }
    if (state.resources.selectedResourceVideo.length === 0) {
      errorMessage = 'Debe seleccionar al menos un video. ';
    }

    if (errorMessage) {
      return  Vue.prototype.$toast.error(errorMessage);
    }

    try {
      resp = await this.$axios.post(
        '/api/v1/add-resource-valoration',
        state.resources
      )
      console.log(resp.status)
      if (resp.status === 200 || resp.status === 201) {
        Vue.prototype.$FModal.hide()
        commit('CLEAR_DATA')
        return  Vue.prototype.$toast.success('Recurso Agregado Correctamente');
      } else {
        commit('CLEAR_DATA')
        return Vue.prototype.$toast.error('No se pudo agregar el recurso');
      }

    } catch (e) {
      // this.$toast.error('Error al agregar el video.');
      console.log('ERROR', e)
      return Vue.prototype.$toast.error('Error al agregar el recurso. Consulte con soporte SaludWom');
    }
  },

  async answerQuestionResource({commit, state}, data) {

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
