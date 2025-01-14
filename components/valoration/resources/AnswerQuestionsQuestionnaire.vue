<template>
    <div>
      <div class="p-5">
        <!-- Titulo  -->
        <h3 class="text-center">{{ questionnaire.name }}</h3>
        <!--  Descripción  -->
        <p>{{ questionnaire.description }}</p>
        <!--  Especialidades   -->
        <div class="my-2">
          <div v-for="(treatment, index) in questionnaire.treatments" :key="index">
            <ul class="m-0">
              <li>
                <p class="font-italic m-0" style="font-size: 13px !important;">{{ treatment.treatment }}. </p>
              </li>
            </ul>
          </div>
        </div>

        <!--  Preguntas   -->
        <div v-for="(question, index) in $store.state.answerQuestions.questions" :key="index">
          <!-- Campo tipo number-->
          <div v-if="question.type_question.name === 'number'" class="mb-2">
            <label class="form-label"
                   for="exampleFormControlTextarea1">{{ question.question }}
              <span v-if="question.required" class="text-danger">*</span>
              <a class="ml-2" v-if="question.ilustration || question.illustration"
                 @click="showIllustration(question)" href="#">Ilustración</a>
            </label>
            <input :disabled="questionnaire.solved" class="form-control w-100" type="number" min="0"
                   v-model="question.value"
                   :name="'question_' + index" :class="{'is-invalid': question.required && question.$error }">
          </div>

          <!-- Campo tipo input-->
          <div v-if="question.type_question.name === 'input'" class="mb-2">
            <label class="form-label"
                   for="exampleFormControlTextarea1">{{ question.question }} <span
              v-if="question.required" class="text-danger">*</span>
              <a class="ml-2" v-if="question.ilustration || question.illustration"
                 @click="showIllustration(question)" href="#">Ilustración</a></label>
            <input :disabled="questionnaire.solved" class="form-control w-100" v-model="question.value" type="text">
          </div>

          <!-- Campo tipo textarea-->
          <div v-if="question.type_question.name === 'textarea'" class="mb-2">
            <label class="form-label"
                   for="exampleFormControlTextarea1">{{ question.question }} <span
              v-if="question.required" class="text-danger">*</span>
              <a class="ml-2" v-if="question.ilustration || question.illustration"
                 @click="showIllustration(question)"
                 href="#">Ilustración</a>
            </label>
            <textarea :disabled="questionnaire.solved" class="form-control"
                      id="exampleFormControlTextarea1" rows="3" v-model="question.value"></textarea>
          </div>

          <!--  Campo tipo select -->
          <div v-if="question.type_question.name === 'select'" class="mb-2">
            <label class="form-label"
                   for="exampleFormControlTextarea1">{{ question.question }} <span
              class="text-danger" v-if="question.required">*</span>
              <a class="ml-2" v-if="question.ilustration || question.illustration"
                 @click="showIllustration(question)" href="#">Ilustración</a>
            </label>
            <br>
            <select :disabled="questionnaire.solved" class="form-select w-100" v-model="question.value">
              <option value="" class="text-light">Selecciona</option>
              <option v-for="(option, index) in jsonParse(question)" :key="index">
                {{ option.option }}
              </option>
            </select>
          </div>

          <div v-if="question.type_question.name === 'checkbox'" class="mb-2">
            <div v-for="(question, questionIndex) in $store.state.answerQuestions.questions" :key="questionIndex">
              <!-- ... tu código anterior ... -->
              <!-- Campo tipo checkbox -->
              <div v-if="question.type_question.name === 'checkbox'" class="mb-2">
                <label class="form-label" for="exampleFormControlTextarea1">{{ question.question }}
                  <span class="text-danger" v-if="question.required">*</span>
                  <a class="ml-2" v-if="question.ilustration || question.illustration"
                     @click="showIllustration(question)" href="#">Ilustración</a>
                </label>
                <div>
                  <div v-if="question.value === undefined">
                    <!-- Inicializar question.$model.value como un arreglo vacío -->
                    <input :disabled="questionnaire.solved" type="hidden" v-model="question.value">
                  </div>
                  <div class="form-check form-check-danger mb-1"
                       v-for="(option, optionIndex) in jsonParse(question)" :key="optionIndex">
                    <input :disabled="questionnaire.solved" type="checkbox"
                           :class="{'is-invalid': question.required && question.$error }"
                           :value="option"
                           :checked="isChecked(question, option.option)"
                           @change="(event) => handleCheckboxChange(question, option, event.target.checked)"
                           class="form-check-input"
                           id="colorCheck5">
                    <label class="form-check-label" for="colorCheck5">{{ option.option }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-secondary mx-1" @click="closeModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "AnswerQuestionsQuestionnaire",
  props:['questionnaire'],
  methods:{
    closeModal(){
      this.$FModal.hide()
    },
    showIllustration(question) {
      // this.$FModal.show(
      //   {
      //     component: PreviewQuestionIlustration,
      //     // clickToClose: false,
      //     // escToClose: false,
      //     placement: 'center center',
      //   },
      //   {
      //     question: question
      //   }
      // )
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
    handleCheckboxChange(question, option, checked) {
      if (Array.isArray(question.value)) {
        console.log(question.value.some(item => item.option === option.option))
        console.log(option.option)
        if (checked && !question.value.includes(option.option)) {
          question.value.push(option);
        } else if (!checked && question.value.some(item => item.option === option.option)) {
          let index =  question.value.findIndex(item => item.option === option.option)
          console.log('ENTRO POR ACÁ', index)
          if (index !== -1){
            question.value.splice(index, 1)
          }

        }
      } else {
        question.value = checked ? [option] : '';
      }
    },
    jsonParse(question) {
      try {
        const parsedOptions = JSON.parse(question.options)
        return Array.isArray(parsedOptions) ? JSON.parse(question.options) : ''
      } catch (error) {
        return question.options
      }
    },
  }
}
</script>

<style scoped>

</style>
