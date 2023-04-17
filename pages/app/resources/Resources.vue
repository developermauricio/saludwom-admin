<template>
  <div class="app-content content file-manager-application">
    <div class="content-overlay"></div>
    <div class="header-navbar-shadow"></div>
    <div class="content-area-wrapper container-xxl p-0">
      <div class="content-right">
        <div class="content-wrapper container-xxl p-0">
          <div class="content-header row">
          </div>
          <div class="content-body">
            <!-- overlay container -->
            <div class="body-content-overlay"></div>

            <!-- file manager app content starts -->
            <div class="file-manager-main-content">
              <div class="file-manager-content-body">
                <!-- Folders Container Starts -->
                <ListFolders/>
                <!-- /Folders Container Ends -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Resources",
}
</script>

<style scoped>

</style>
