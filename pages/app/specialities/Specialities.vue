<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row mb-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Especialidades</h1>
          <button class="btn btn-primary" @click="openAddSpecialities">Agregar Especialidad</button>
        </div>
      </div>
      <div class="content-body">
        <ListSpecialities/>
      </div>
    </div>
  </div>
</template>

<script>
import AddSspecialty from "@/components/admin/specialities/AddSspecialty.vue";

export default {
  name: "Specialities",
  methods: {
    openAddSpecialities(){
      this.$FModal.show(
        {
          component: AddSspecialty,
          placement: 'center top'
        }
      )
    }
  }
}
</script>


<style scoped>

</style>
