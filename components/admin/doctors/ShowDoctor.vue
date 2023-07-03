<template>
  <div class="p-5">
    <!--   Nombre y Biografia     -->
    <div>
      <h3 class="text-center">Esp. {{ doctor.name }} {{ doctor.last_name }}</h3>
      <p class="text-justify">{{ doctor.biography }}</p>
      <div>
        <div v-for="(treatment, index) in doctor.treatments" :key="treatment.id">
<!--          <span class="badge badge-secondary ml-1" style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ treatment.treatment }}</span>-->
          <ul>
            <li class="font-italic text-muted">
              {{ treatment.treatment }}
            </li>
          </ul>
        </div>
      </div>
    </div>

<!--    <pre>{{ doctor.treatments }}</pre>-->
  </div>
</template>

<script>
export default {
  name: "ShowDoctor",
  props: ['doctor']
}
</script>

<style scoped>

</style>
