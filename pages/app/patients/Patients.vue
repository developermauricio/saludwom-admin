<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row">
        <div class="content-header-left col-md-9 col-12 mb-2">
          <div class="row breadcrumbs-top">
            <div class="col-12">
              <h1 class="content-header-title  mb-0">Pacientes</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="content-body">
        <PatientsDoctor v-role="'Doctor'"/>
<!--        <PatientsAdmin v-role="'Admin'"/>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Patients",
}
</script>

<style scoped>

</style>
