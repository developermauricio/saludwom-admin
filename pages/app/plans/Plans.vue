<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row mb-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Planes</h1>
          <button class="btn btn-primary" @click="openAddPlans">Agregar Plan</button>
        </div>
      </div>
      <div class="content-body">
        <ListPlans/>
      </div>
    </div>
  </div>
</template>

<script>

import AddPlan from "@/components/admin/plans/AddPlan.vue";

export default {
  name: "Plans",
  methods: {
    openAddPlans() {
      this.$FModal.show(
        {
          component: AddPlan,
          placement: 'center top',
        },
      )
    }
  }
}
</script>

<style scoped>

</style>
