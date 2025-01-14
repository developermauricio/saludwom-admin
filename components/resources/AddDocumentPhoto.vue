<template>
  <div>
    <label
      for="image"
      :class="{ 'text-danger': $v.pathDocumentPhoto.$error }"
      class="form-label"
    >Agregar Documento o Imagen <span class="text-danger">*</span>
    </label>
    <p class="text-danger font-weight-bold" v-if="$v.pathDocumentPhoto.$error">La imagen o el documento es
      requerido.</p>
    <div v-if="editResource" class="my-2">
      <h5 class="cursor-pointer" @click="editResourceDocumentImage">
        {{ editDocumentImage ? 'Cancelar' : 'Cambiar Archivo' }}</h5>
    </div>

    <div>
      <UploadFiles
        :uploadUrl="uploadUrl"
        :theme="theme"
        :multiple="multiple"
        :accept="accept"
        :maxSize="maxSize"
        :maxFiles="maxFiles"
        :helpText="helpText"
        :errorText="errorText"
        @fileRecords="resource"
        ref="uploadPicture"/>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "AddDocumentPhoto",
  data() {
    return {
      editDocumentImage: false,
      pathDocumentPhotoUrl: false,
      pathDocumentPhoto: String(),

      uploadUrl: '',
      theme: '',
      multiple: false,
      accept: 'image/*,.pdf,.doc,.docx,.ods',
      maxSize: '100MB',
      maxFiles: 1,
      helpText: 'Clic o arrastra aquí documento o imagen',
      errorText: {
        type: 'Tipo de archivo incorrecto, agrega documentos o imágenes',
        size: 'Esta imagen no se guardará. Los documentos o imágenes no deben superar los 100 MB de tamaño',
      }
    }
  },
  validations: {
    pathDocumentPhoto: {required}
  },
  props: ['editResource'],
  methods: {
    editResourceDocumentImage() {
      this.editDocumentImage = !this.editDocumentImage
      if (this.editDocumentImage){
        this.$store.state.currentVideo = this.pathVideo
        console.log(this.$store.state.currentVideo)
      }else{
        this.pathVideo = this.$store.state.currentVideo
      }
    },

    resource(file) {
      this.pathDocumentPhoto = file[0]
    },
    validation() {
      if (!this.editResource) {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.$emit('invalidFormVideo', true)
          return
        }
        return this.$emit('invalidFormVideo', false)
      }
    },
  },
  watch: {
    pathDocumentPhoto: {
      handler(val) {
        setTimeout(() => {
          this.$emit('dataResource', val)
        }, 200)
      },
      deep: true
    },
  },
  mounted() {
    bus.$on('validatePathDocument', () => {
      this.validation()
    })
  },
}
</script>

<style scoped>

</style>
