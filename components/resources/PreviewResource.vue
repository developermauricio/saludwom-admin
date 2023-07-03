<template>
  <div class="p-3">
    <div
      v-if="resource.type_file === 'docx' || resource.type_file === 'doc' || resource.type_file === 'pptx' || resource.type_file === 'xlsx' || resource.type_file === 'csv'">
      <VueDocPreview :value="file(resource)" type="office"/>
    </div>
    <div
      v-if="resource.type_file === 'jpg' || resource.type_file === 'png' || resource.type_file === 'gif' || resource.type_file === 'heif' ||
    resource.type_file === 'hevc' || resource.type_file === 'psd' || resource.type_file === 'svg'|| resource.type_file === 'jpeg' || resource.type_file === 'webp'">
      <div class="text-center">
        <vue-load-image>
          <img slot="image" class="w-75 h-50" :src="file(resource)" alt="SaludWom"/>
          <img slot="preloader" src="@/assets/img/loading-image-saludwom.gif" alt=""/>
          <div slot="error">error message</div>
        </vue-load-image>
        <!--        <img @load="onImgLoad" class="w-75 h-50" :src="file(resource)" alt="SaludWom">-->
      </div>
    </div>
    <div v-if="resource.type_file === 'pdf'">
      <embed :src="file(resource)+'#toolbar=0&navpanes=0&scrollbar=0'" type="application/pdf"
             width="100%" height="600px"/>

      <!--     <iframe :src="'https://docs.google.com/viewer?url='+$config.urlBack+resource.path_file+'&embedded=true'" style="border: none; width: 100%; height: 50rem"></iframe>-->
    </div>
    <div
      v-if="resource.type_file === 'iframe' || resource.type_file === 'mov' || resource.type_file === 'mp4' || resource.type_file === 'wmv' || resource.type_file === 'avi'">
      <div v-if="pathVideo(resource.path_file)">
        <video class="w-100" controls :src="file(resource)" style="height: 50%"></video>
      </div>
      <div v-else>
        <div class="w-100 text-center iframe-video" v-html="resource.path_file">{{ resource.path_file }}</div>
      </div>
    </div>
    <div class="my-2 w-auto">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h3>{{ resource.resources_folder_content.name }}</h3>
        </div>
        <div>
        <span :class="`badge bg-${stateResource(resource.resources_folder_content.state)}`">{{
            resource.resources_folder_content.state === '1' ? 'Disponible' : 'No Disponible'
          }}</span>
        </div>
      </div>
      <p class="text-justify mt-2">{{ resource.resources_folder_content.description }}</p>
    </div>
        <div class="my-2">
          <div v-for="(treatment, index) in resource.resources_folder_content.treatments" :key="index">
            <!--            <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>-->
            <ul class="m-0">
              <li>
                <p class="font-italic text-muted m-0" style="font-size: 12px">{{ treatment.treatment }}. </p>
              </li>
            </ul>
          </div>
        </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "PreviewResource",
  props: ['dataResource', 'resourceFolder'],
  data() {
    return {
      resource: null
    }
  },
  methods: {
    file(file) {
      switch (file.storage) {
        case 'cloud':
          return this.$config.urlDigitalOcean + file.path_file
        case 'local':
          return this.$config.urlBack + file.path_file
      }
    },
    stateResource(state) {
      switch (state) {
        case '1':
          return 'success'
        case '2':
          return 'danger'
      }
    },
    pathVideo(file) {
      const url = new URL(file, window.location.href);
      const ruta = url.pathname.split('/');
      const storage = ruta[1];
      switch (storage) {
        case 'storage':
          return this.$config.urlBack + file
        case 'cloud':
          return this.$config.urlDigitalOcean + file;
        case '':
          return false
      }
    }
  },
  beforeMount() {
    console.log('ENTRO AL BEFORE ', this.dataResource)
    // this.resource.type_file = this.dataResource.type_file
    // this.resource.path_file = this.dataResource.path_file
    // this.resource.resources_folder_content.name = this.dataResource.path_file
    if (this.resourceFolder){
      this.resource = this.resourceFolder
    }

    if (this.dataResource) {
      this.resource = this.dataResource.archive
      let newObject = {
        name: this.dataResource.name,
        state: this.dataResource.state,
        description: this.dataResource.description
      }
      Vue.set(this.resource, 'resources_folder_content', newObject)
    }
  }
}
</script>

<style scoped>

</style>
