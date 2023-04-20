<template>
  <div class="card">
    <div class="card-img-top file-logo-wrapper">
      <div class="dropdown float-end">
        <i data-feather="more-vertical" class="toggle-dropdown mt-n25"></i>
      </div>
      <div class="d-flex align-items-center justify-content-center w-100 cursor-pointer"
           @click="openResource(resource)">
        <div v-html="$feathericons[iconCardResource(resource.type_file)].toSvg()"></div>
      </div>
    </div>
    <div class="card-body pt-0 pl-0 pr-0">
       <span :class="`badge w-100 bg-${stateResource(resource.resources_folder_content.state)}`">{{
           resource.resources_folder_content.state === '1' ? 'Disponible' : 'No Disponible'
         }}</span>
      <div class="p-2">
        <div class="content-wrapper cursor-pointer d-flex justify-content-between mb-2">
          <div @click="openResource(resource)">
            <a href="#" class="card-text file-name mb-0">{{ resource.resources_folder_content.name }}</a>
          </div>
          <div class="d-flex justify-content-between" v-if="!selected">
            <div>
              <a href="#" id="dropdownMenuCardResource" data-bs-toggle="dropdown" aria-expanded="false">
                <div v-html="$feathericons['more-vertical'].toSvg()"></div>
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuCardResource">
                <a class="dropdown-item" href="#" @click="openModalEdit(resource)">Actualizar</a>
                <a class="dropdown-item" href="#">Eliminar</a>
              </div>
            </div>
          </div>

          <!--        <p class="card-text file-date">01 may 2019</p>-->
        </div>
        <small class="file-accessed">{{ resource.resources_folder_content.description | truncate(20) }}</small>
<!--        <div class="mt-2">-->
<!--          <div>-->
<!--            <div v-for="(treatment, index) in resource.resources_folder_content.treatments" :key="index">-->
<!--              &lt;!&ndash;            <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>&ndash;&gt;-->
<!--              <ul class="m-0">-->
<!--                <li>-->
<!--                  <p class="font-italic text-muted m-0" style="font-size: 12px">{{ treatment.treatment }}. </p>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div v-if="selected === true" class="mt-2">
            <div>
              <button  :class="`btn btn-${isSelected(resource) ? 'success':'primary'} btn-sm float-right`" @click="selectedResource(resource)">{{ isSelected(resource) ? 'Seleccionado' : 'Seleccionar' }}</button>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>


import PreviewResource from "./PreviewResource";
import AddFormResource from "./AddFormResource";
import {mapState} from "vuex";

export default {
  name: "CardResource",
  props: ['resource', 'folderId', 'selected'],
  computed: {
    ...mapState(['resources']),
    isSelected() {
      return resource => this.resources.resources.selectedResourceVideo.find((item) =>{return resource.id === item.id})
    },
  },
  methods: {
    selectedResource(resource){
      this.$store.commit('SET_SELECTED_RESOURCE_VIDEO', resource)
    },
    openResource(resource) {
      this.$FModal.show(
        {
          component: PreviewResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          resource: resource
        }
      )
    },
    openModalEdit(resource) {
      this.$FModal.show(
        {
          component: AddFormResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          editResource: true,
          resource: resource,
          folderId: this.folderId
        }
      )
    },
    stateResource(state) {
      switch (state) {
        case '1':
          return 'success'
        case '2':
          return 'danger'
      }
    },
    iconCardResource(type) {
      switch (type.toLowerCase()) {
        case 'mov':
          return 'video'
        case 'mp4':
          return 'video'
        case 'wmv':
          return 'video'
        case 'avi':
          return 'video'
        case 'iframe':
          return 'video'
        case 'docx':
          return 'icon-doc.png'
        case 'doc':
          return 'icon-doc.png'
        case 'pdf':
          return 'icon-pdf.png'
        case 'png':
          return 'icon-image.png'
        case 'jpg':
          return 'icon-image.png'
        case 'jpeg':
          return 'icon-image.png'
        case 'webp':
          return 'icon-image.png'
        case 'gif':
          return 'icon-image.png'
        case 'heif':
          return 'icon-image.png'
        case 'hevc':
          return 'icon-image.png'
        case 'psd':
          return 'icon-image.png'
        case 'svg':
          return 'icon-image.png'
      }
    }
  }
}
</script>

<style scoped>

</style>
