<template>
  <div class="card file-manager-item folder" @click="open(folder)">
    <div class="card-img-top file-logo-wrapper">
      <div class="dropdown float-end">
        <i data-feather="more-vertical" class="toggle-dropdown mt-n25"></i>
      </div>
      <div class="d-flex align-items-center justify-content-center w-100">
        <div v-html="$feathericons['folder'].toSvg()"></div>
      </div>
    </div>
    <div class="card-body">
      <div class="content-wrapper">
        <p class="card-text file-name mb-0">{{ folder.folder }}</p>
        <p class="card-text file-size mb-0">{{ folder.state }}</p>
        <!--        <p class="card-text file-date">01 may 2019</p>-->
      </div>
      <small class="file-accessed text-muted">{{ folder.description }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardFolder",
  props: ['folder'],
  methods: {
    open(folder) {
      console.log(folder)
      this.$router.push(
        {
          path: `/recursos/${folder.slug}/${folder.id}`,
          params: {name: folder}
        },
      );
    }
  }
}
</script>

<style scoped>

</style>
