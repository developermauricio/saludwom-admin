<template>
  <div>
    <vs-tabs alignment="center" color="#792141">
      <vs-tab label="Lista de Preguntas">
        <div>
            <Questions/>
        </div>
      </vs-tab>
      <vs-tab label="Vista Previa">
        <div>
          <PreviewQuestionnaire/>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
export default {
  name: "ListQuestionsQuestionnaires",
}
</script>

<style scoped>

</style>
