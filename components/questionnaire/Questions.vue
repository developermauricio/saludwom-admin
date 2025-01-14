<template>
  <div>
    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th>Pregunta</th>
          <th>Tipo</th>
          <th>Requerido</th>
          <th>Ilustración</th>
          <th>Opciones</th>
          <th v-role="'Admin'">Quitar</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(question, index) in isAdd ? this.$store.state.app.questionnaire.questions : questions" :key="index">
          <td>{{ question.question }}</td>
          <td>{{ question.type_question.name }}</td>
          <!--          <td>{{ questionRequired(question.required) }}</td>-->
          <td>{{ question.required === true || question.required === 1 ? 'Si' : 'No' }}</td>
          <td class="text-center">
            <img @click="previewIlustration(question)" v-if="question.illustration"
                 width="50" height="50"
                 :src="question.illustration.urlResized ?  question.illustration.urlResized  : $config.urlBack+question.illustration"
                 alt="" style="cursor: pointer">
            <div class="text-center" v-else>--</div>
          </td>
          <td class="text-center">
            <!--            {{ question.options }}-->
            <div class="text-center" v-if=" question.options.length === 0">--</div>
            <div v-else>
              {{
                (() => {
                  try {
                    const parsedOptions = JSON.parse(question.options);
                    return Array.isArray(parsedOptions) ? parsedOptions.map(item => item.option).join(', ') : 'Holas';
                  } catch (error) {
                    return question.options.map(item => item.option).join(', ');
                  }
                })()
              }}
            </div>

          </td>
          <td v-role="'Admin'">
            <a href="#" @click="removeQuestion(index, question)">Eliminar</a>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="$store.getters.listQuestions.length === 0" class="text-center mt-2">No hay preguntas</div>
    </div>
  </div>
</template>

<script>
import PreviewIlustration from "./PreviewIlustration";

export default {
  name: "Questions",
  data() {
    return {
      dragging: false,
      questions: [],
    }
  },
  props: ['question', 'isAdd'],
  methods: {
    questionRequired(required) {
      console.log('Validación ', required)
      return required === true || 1 || '1' ? 'Si' : 'No'
    },
    previewIlustration(question) {
      this.$FModal.show(
        {
          component: PreviewIlustration,
          // clickToClose: false,
          // escToClose: false, d
          placement: 'center center',
        },
        {
          question: question
        }
      )
    },
    removeQuestion(index, question) {

      this.$store.commit('SET_REMOVE_QUESTIONS', question)

      if (this.isAdd){
        this.$store.state.app.questionnaire.questions.splice(index, 1)
        return
      }

      this.questions.splice(index, 1)
    }
  },
  created() {
    this.questions = this.question ? this.question.slice() : [];
  },
}
</script>

<style scoped>

</style>
