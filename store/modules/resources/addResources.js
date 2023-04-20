export const state = () => ({
  resources: {
    valuation: null,
    touchData: false,
    selectedQuestionnaires: [],
    selectedResourceVideo: [],
    description: String()
  },
})

export const mutations = {
  SET_VALORATION(state, data) {
    state.resources.valuation = data

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
    console.log(indexResource)
    if (indexResource !== -1) {
      state.resources.selectedResourceVideo.splice(indexResource, 1)
    } else {
      state.resources.selectedResourceVideo.push(video)
    }
  },
  CLEAR_DATA(state) {
    state.resources.selectedQuestionnaires = []
    state.resources.valuation = null
    state.resources.touchData = false
    state.resources.selectedQuestionnaires = []
    state.resources.selectedResourceVideo = []
    state.resources.description = ''
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
  clearData({commit, state}) {
    commit('CLEAR_DATA')
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
      return errorMessage
    }
    console.log(state.resources.valuation)
    return
    try {
      resp = await this.$axios.post(
        `/api/v1/add-resource-valoration/${state.resources.valuation}`,
        state.resources
      )
      if (resp.status === 200 || resp.status === 204) {
        return resp = true
      } else {
        return resp = false
      }

    } catch (e) {
      // this.$toast.error('Error al agregar el video.');
      console.log('ERROR', e)
      return resp = false
    }
  }
}
