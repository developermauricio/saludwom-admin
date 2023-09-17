<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row mb-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Especialistas</h1>
          <button class="btn btn-primary" @click="openAddDoctor">Agregar Especialista</button>
        </div>
      </div>
      <div class="content-body">
        <ListsDoctors/>
      </div>
    </div>
  </div>
</template>

<script>

import AddDoctor from "../../../components/admin/doctors/AddDoctor";

export default {
  name: "Doctors",
  methods:{
    openAddDoctor(){
      this.$FModal.show(
        {
          component: AddDoctor,
          placement: 'center top',
        },
      )
    },
  }
}
</script>

<style scoped>

</style>
