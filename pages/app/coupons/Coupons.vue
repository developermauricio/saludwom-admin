<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row my-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Cupones</h1>
          <button class="btn btn-primary" @click="openAddCoupon">Agregar Cupón</button>
        </div>
      </div>
      <div class="content-body">
        <ListCoupons/>
      </div>
    </div>
  </div>
</template>

<script>
import AddCoupons from "@/components/admin/coupons/AddCoupons.vue";

export default {
  name: "Coupons",
  methods: {
    openAddCoupon() {
      this.$FModal.show(
        {
          component: AddCoupons,
          placement: 'center top'
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
