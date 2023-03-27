<template>
    <div>
      <h4>{{ subscription.plan.name  }}.</h4>
      <p class="text-justify">{{ subscription.plan.description }}</p>
    </div>
</template>

<script>
export default {
  name: "InfoSubscription",
  props:['subscription']
}
</script>

<style scoped>

</style>
