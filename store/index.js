import Vue from 'vue'
import Vuex from 'vuex'
// Here we import everything that is exported
// from the below directory, allowing us to create the store
import * as app from './modules/app/index'
import * as resources from './modules/resources/addResources'
import * as answerQuestions from './modules/resources/answerQuestions'
import * as resourceFolder from './modules/resourcesFolder/folder'
import * as addVideoFolder from './modules/resourcesFolder/addVideoFolder'

Vue.use (Vuex)

export default () => new Vuex.Store({
  modules: {
    app,
    resources,
    addVideoFolder,
    resourceFolder,
    answerQuestions
  }
})
