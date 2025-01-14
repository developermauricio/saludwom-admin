<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row my-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title mb-0">Citas</h1>
          <button class="btn btn-primary" @click="openAddAppointment">Agendar Cita</button>
        </div>
      </div>
      <div class="content-body">
        <AppointmentsAdmin/>
        <!--        <PatientsDoctor v-role="'Doctor'"/>-->
      </div>
    </div>
  </div>
</template>

<script>

import AddAppointment from "@/components/admin/appointments/AddAppointment.vue";

export default {
  name: "Appointments",
  methods: {
    openAddAppointment() {
      this.$FModal.show(
        {
          component: AddAppointment,
          placement: 'center top',
        },
      )
    }
  }
}
</script>

<style scoped>

</style>
