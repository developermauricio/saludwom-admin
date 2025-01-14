<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row my-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Pacientes</h1>
          <button class="btn btn-primary" @click="openAddPatient">Agregar Paciente</button>
        </div>
      </div>
      <div class="content-body">
        <!--        <PatientsDoctor v-role="'Doctor'"/>-->
                <PatientsAdmin v-role="'Admin'"/>
      </div>
    </div>
  </div>
</template>

<script>
import AddPatient from "@/components/admin/patients/AddPatient.vue";

export default {
  name: "Patients",
  methods: {
    openAddPatient() {
      this.$FModal.show(
        {
          component: AddPatient,
          placement: 'center top',
        },
      )
    }
  }
}
</script>

<style scoped>

</style>
