<template>
  <div class="p-3 text-center" v-if="question">
    <img :src="question.illustration.urlResized ? question.illustration.urlResized : $config.urlBack+question.illustration" alt="" style="width: 100%; height: 100%">
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
