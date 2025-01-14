<template>
  <div>
    <vs-tabs alignment="center" color="#792141">
      <vs-tab label="Lista de Preguntas">
        <div>
            <Questions :isAdd="isAdd" :question="questions"/>
        </div>
      </vs-tab>
      <vs-tab label="Vista Previa">
        <div>
          <PreviewQuestionnaire :question="questions" :questionnaire="questionnaire"/>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
export default {
  name: "ListQuestionsQuestionnaires",
  props: ['questions', 'questionnaire', 'isAdd']
}
</script>

<style scoped>

</style>
