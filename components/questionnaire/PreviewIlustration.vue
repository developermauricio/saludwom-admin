<template>
  <div class="p-3 text-center">
    <h3>{{ question.question }}</h3>
    <img :src="question.illustration ? $config.urlBack+question.illustration : question.ilustration.urlResized" alt="" style="width: 100%; height: 100%">
  </div>
</template>

<script>
export default {
  name: "PreviewIlustration",
  props: ['question']
}
</script>

<style scoped>

</style>
