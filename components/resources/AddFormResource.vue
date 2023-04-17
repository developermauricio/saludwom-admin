<template>
  <div class="p-3">

    <h3>{{ editResource ? 'Actualizar Recurso': 'Agregar Recurso'}}</h3>
    <div>
      <AddFormValuationVideo :folderId="folderId" :video="resource" :editResource="editResource"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddFormResource",
  props:['resource', 'editResource', 'folderId'],
}
</script>

<style scoped>

</style>
