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
          <th>Quitar</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(question, index) in $store.state.app.questionnaire.questions" :key="index">
          <td>{{ question.question }}</td>
          <td>{{ question.type.name }}</td>
          <td>{{ question.required ? 'Si' : 'No' }}</td>
          <td class="text-center">
            <img @click="previewIlustration(question.ilustration.urlResized, question.question)" v-if="question.ilustration || question.illustration" width="50" height="50" :src="question.illustration ? $config.urlBack+question.illustration : question.ilustration.urlResized" alt="" style="cursor: pointer">
            <div class="text-center" v-else>&#45;&#45;</div>
          </td>
          <td class="text-center">
            <div class="text-center" v-if="question.options.length === 0">&#45;&#45;</div>
            <div v-else>[{{
                question.options.map(item => {
                  return item.option
                }).join(', ')
              }}]
            </div>
          </td>
          <td>
            <a href="#" @click="removeQuestion(index)">Eliminar</a>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="$store.getters.listQuestions.length === 0" class="text-center mt-2">No hay preguntas</div>
    </div>
  </div>
</template>

<script>
import {bus} from "../../plugins/bus";
import AddIlustration from "./AddIlustration";
import PreviewIlustration from "./PreviewIlustration";

export default {
  name: "Questions",
  data() {
    return {
      dragging: false,
    }
  },
  methods: {
    previewIlustration(ilustration, question){
      this.$FModal.show(
        {
          component: PreviewIlustration,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center center',
        },
        {
          ilustration: ilustration,
          question: question
        }
      )
    },
    removeQuestion(index) {
      this.$store.state.app.questionnaire.questions.splice(index, 1)
    }
  },
}
</script>

<style scoped>

</style>
