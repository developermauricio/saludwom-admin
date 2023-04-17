<template>
  <div class="px-2 pb-2">
    <div class="pt-2 pb-2">
      <h4>Agregar Ilustración</h4>
    </div>
    <div class="pb-3">
      <UploadFiles
        :uploadUrl="uploadUrl"
        :theme="theme"
        :multiple="multiple"
        :accept="accept"
        :maxSize="maxSize"
        :maxFiles="maxFiles"
        :helpText="helpText"
        :errorText="errorText"
        @fileRecords="file"
      />
    </div>
    <div class="d-flex justify-content-end">
      <button class="btn btn-success" @click="addIllustration" v-if="illustration"> Agregar Ilustración</button>
    </div>
  </div>
</template>

<script>
import {bus} from "../../plugins/bus";

export default {
  name: "AddIlustration",
  data() {
    return {
      illustration: '',

      uploadUrl: '',
      theme: '',
      multiple: false,
      accept: 'image/*',
      maxSize: '10MB',
      maxFiles: 1,
      helpText: 'Clic o arrastra aquí imágenes',
      errorText: {
        type: 'Tipo de archivo incorrecto, agrega imagenes',
        size: 'Esta imagen no se guardará. Las imagenes no deben superar los 10 MB de tamaño',
      }
    }
  },
  methods: {
    addIllustration(){
      bus.$emit('addIlustration', this.illustration)
      this.$FModal.hide()
    },
    file(file) {
      this.illustration = file[0]
    }
  }
}
</script>

<style scoped>

</style>
