<template>
  <div>
    <!--  Titulo y Descripción  -->
    <div class="row my-2">
      <div class="col-12">
        <h3 class="text-center font-weight-bold">{{ $store.state.app.questionnaire.name }}</h3>
        <p class="text-justify">{{ $store.state.app.questionnaire.description }}</p>

        <ul class="list-unstyled">
          <li  v-for="(treatment, index) in $store.state.app.questionnaire.treatments" :key="index" class="fz-14 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {{ treatment.treatment }}.
          </li>
        </ul>
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
                <input  class="form-control" type="number" min="0" v-model="question.value">
              </div>
              <!-- Campo tipo input-->
              <div v-if="question.type_question.name === 'input'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  v-if="question.required" class="text-danger">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <input  class="form-control w-100" v-model="question.value">
              </div>
              <!-- Campo tipo textarea-->
              <div v-if="question.type_question.name === 'textarea'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  v-if="question.required" class="text-danger">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <textarea  class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="question.value"></textarea>
              </div>
              <!-- Campo tipo select-->
              <div v-if="question.type_question.name === 'select'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span
                  class="text-danger" v-if="question.required">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>
                <select class="form-select" id="basicSelect" v-model="question.value">
                  <option value="">Selecciona</option>
                  <option v-for="(option, index) in jsonParse(question)" :key="index">
                    {{ option.option }}
                  </option>
                </select>
              </div>
              <!-- Campo tipo checkbox-->
<!--              <div v-if="question.type_question.name === 'checkbox'" class="mb-2">-->
<!--                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }} <span-->
<!--                  class="text-danger" v-if="question.required">*</span><a class="ml-2" v-if="question.ilustration || question.illustration" @click="previewIlustration(question)" href="#">Ilustración</a></label>-->
<!--&lt;!&ndash;                <div class="form-check form-check-danger mb-1" v-for="(option, index) in JSON.parse(question.options)" :key="index">&ndash;&gt;-->
<!--                <div class="form-check form-check-danger mb-1" v-for="(option, index) in jsonParse(question)" :key="index">-->
<!--                  <input  type="checkbox" class="form-check-input" :value="option" id="colorCheck5" v-model="question.value">-->
<!--                  <label class="form-check-label" for="colorCheck5">{{ option.option }}</label>-->
<!--                </div>-->
<!--              </div>-->


              <div v-if="question.type_question.name === 'checkbox'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }}
                  <span class="text-danger" v-if="question.required">*</span>
                  <a class="ml-2" v-if="question.ilustration || question.illustration"
                     @click="previewIlustration(question)" href="#">Ilustración</a>
                </label>
                <div>

                  <div class="form-check form-check-danger mb-1"
                       v-for="(option, optionIndex) in jsonParse(question)" :key="optionIndex">
                    <input  type="checkbox"
                           :class="{'is-invalid': question.required && question.$error }"
                           :value="option"
                           :checked="isChecked(question, option.option)"
                           class="form-check-input"
                           id="colorCheck5">
                    <label class="form-check-label" for="colorCheck5">{{ option.option }}</label>
                  </div>
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
    isChecked(question, option) {
      if (question.value) {
        let questionAnswer = question.value

        if (this.questionnaire.solved) {
          questionAnswer = JSON.parse(questionAnswer)
          return question.value.includes(option);
        }

        if (Array.isArray(questionAnswer)) {
          question.value.includes(option);
        }
        // return false;
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
