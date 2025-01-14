<template>
  <div class="app-content content ">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-wrapper container-xxl p-0">
      <div class="content-header row mb-2">
        <div class="d-flex justify-content-between">
          <h1 class="content-header-title  mb-0">Ordenes de Compra</h1>
        </div>
      </div>
      <div class="content-body">
        <ListOrders/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Orders"
}
</script>

<style scoped>

</style>
