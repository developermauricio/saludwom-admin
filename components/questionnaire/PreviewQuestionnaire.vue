<template>
  <div>
    <!--  Titulo y Descripción  -->
    <div class="row my-2">
      <div class="col-12">
        <h3 class="text-center font-weight-bold">{{ $store.state.app.questionnaire.name }}</h3>
        <p class="text-justify">{{ $store.state.app.questionnaire.description }}</p>
        <div class="">
          <span class="badge bg-primary mr-1 mb-1"
                v-for="(treatment, index) in $store.state.app.questionnaire.treatments"
                :key="index">{{ treatment.treatment }}</span>
        </div>
      </div>
    </div>
    <!--  Preguntas Formulario  -->
    <p  v-role="'Admin'" class="font-italic">Al lado de cada pregunta, hay un icono <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                   class="bi bi-grip-horizontal" viewBox="0 0 16 16" style="cursor: pointer">
      <path
        d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg> que permite arrastrar y soltar para cambiar el orden de las preguntas.</p>
    <div class="row">
      <draggable ghost-class="ghost" :list="$store.state.app.questionnaire.questions" group="people" :disabled="false"
                 @start="dragging = true">
        <div class="col-12" v-for="(question, index) in $store.state.app.questionnaire.questions" :key="index">

          <div class="d-flex align-items-center">
            <div class="mr-3" v-role="'Admin'">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   class="bi bi-grip-horizontal" viewBox="0 0 16 16" style="cursor: pointer">
                <path
                  d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <div class="w-100">
              <!-- Campo tipo number-->
              <div v-if="question.type_question.name === 'number'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  v-if="question.required" class="text-danger">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <input :disabled="$store.state.app.questionnaire.solved" class="form-control" type="number" min="0" v-model="question.value">
              </div>
              <!-- Campo tipo input-->
              <div v-if="question.type_question.name === 'input'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  v-if="question.required" class="text-danger">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <input :disabled="$store.state.app.questionnaire.solved" class="form-control w-100" v-model="question.value">
              </div>
              <!-- Campo tipo textarea-->
              <div v-if="question.type_question.name === 'textarea'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  v-if="question.required" class="text-danger">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <textarea :disabled="$store.state.app.questionnaire.solved" class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="question.value"></textarea>
              </div>
              <!-- Campo tipo select-->
              <div v-if="question.type_question.name === 'select'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  class="text-danger" v-if="question.required">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <select :disabled="$store.state.app.questionnaire.solved" class="form-select" id="basicSelect" v-model="question.value">
                  <option value="">Selecciona</option>
                  <option v-for="(option, index) in jsonParse(question)" :key="index">
                    {{ option.option }}
                  </option>
                </select>
              </div>
              <!-- Campo tipo checkbox-->
              <div v-if="question.type_question.name === 'checkbox'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  class="text-danger" v-if="question.required">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
<!--                <div class="form-check form-check-danger mb-1" v-for="(option, index) in JSON.parse(question.options)" :key="index">-->
                <div class="form-check form-check-danger mb-1" v-for="(option, index) in jsonParse(question)" :key="index">
                  <input :disabled="$store.state.app.questionnaire.solved" type="checkbox" class="form-check-input" :value="option" id="colorCheck5" v-model="question.value">
                  <label class="form-check-label" for="colorCheck5">{{ option.option }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </draggable>
    </div>
    <div class="row">
      <div class="col-12" v-if="$store.state.app.questionnaire.questions.length === 0">
        <p class="text-center">No hay preguntas</p>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import PreviewIlustration from "./PreviewIlustration";

export default {
  components: {
    draggable
  },
  name: "PreviewQuestionnaire",

  methods:{
    jsonParse(question){
      try {
        const parsedOptions = JSON.parse(question.options)
        return Array.isArray(parsedOptions) ? JSON.parse(question.options): ''
      } catch (error) {
        return question.options
      }
    },
    previewIlustration(question){
      this.$FModal.show(
        {
          component: PreviewIlustration,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center center',
        },
        {
          question: question
        }
      )
    },
  }
}
</script>

<style scoped>

</style>
