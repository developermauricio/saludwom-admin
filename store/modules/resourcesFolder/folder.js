export const state = () => ({
    folders: [],
})

export const mutations = {
  SET_FOLDERS(state, data){
    state.folders = data
  }
}
// export const getters = {}
export const actions = {
  getFolders({commit, state}) {
    this.$axios.$get('/api/v1/get-folders').then(resp => {
      commit('SET_FOLDERS', resp.data)
    }).catch(e => {
      console.log('ERROR ', e)
      this.$toast.error('Error al obtener los recursos por carpetas.');
      state.dataLoading = true
    })
  },
}
export const getters = {
  listFolders: state => state.folders
}
