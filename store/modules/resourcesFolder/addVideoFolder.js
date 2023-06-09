export const state = () => ({
  videos: [],
  dataLoading: false,
  currentVideo: '',
})

export const mutations = {
  SET_VIDEOS_RESOURCE_FOLDER(state, data) {
    if (data) {
      state.videos.push(data)
      state.dataLoading = false
    } else {
      state.dataLoading = true
    }
  },
  SET_VIDEO_RESOURCE_FOLDER(state, data) {
    if (data) {
      state.videos.unshift(data)
    }
  },
}
export const actions = {

  getVideosResourceFolder({commit, state}, folderId) {
    this.$axios.$get(`/api/v1/get-files-resource-to-folder/${folderId}`).then(resp => {
      state.videos = []
      console.log('VIDES RESOURCE ', resp.data)
      resp.data.forEach(item =>{
        if (item.state === '1'){
          commit('SET_VIDEOS_RESOURCE_FOLDER', item)
        }
      })


    }).catch(e => {
      console.log('ERROR ', e)
      this.$toast.error('Error al obtener los videos.');
      state.dataLoading = true
    })
  },

  async addVideo({commit, state, dispatch}, data) {
    let resp
    try {
      resp = await this.$axios.post(
        '/api/v1/add-resource-folder',
        data
      )
      if (resp.status === 200 || resp.status === 204) {
        // commit('SET_VIDEO_RESOURCE_FOLDER', data)
        return resp = true
      } else {
        return resp = false
      }

    } catch (e) {
      // this.$toast.error('Error al agregar el video.');
      console.log('ERROR', e)
      return resp = false
    }
  },
  async updateVideo({commit, state, dispatch}, {form, id}) {
    let resp
    try {
      resp = await this.$axios.post(
        `/api/v1/update-resource-folder/${id}`,
        form
      )
      if (resp.status === 200 || resp.status === 204) {
        // commit('SET_VIDEO_RESOURCE_FOLDER', data)
        return resp = true
      } else {
        return resp = false
      }

    } catch (e) {
      // this.$toast.error('Error al agregar el video.');
      console.log('ERROR', e)
      return resp = false
    }
  },
}
export const getters = {
  listVideosResourceFolder: state => state.videos
}
