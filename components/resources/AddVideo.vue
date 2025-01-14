<template>
  <div>
    <label
      for="image"
      :class="{ 'text-danger': $v.pathVideo.$error }"
      class="form-label"
    >Agregar Video <span class="text-danger">*</span>
    </label>
    <p class="text-danger font-weight-bold" v-if="$v.pathVideo.$error">El video es requerido.</p>
    <div v-if="editResource" class="my-2">
      <h5 class="cursor-pointer" @click="editSourceVideo">
        {{ editVideo ? 'Cancelar' : 'Cambiar Video' }}</h5>
    </div>

    <!--  Imagen del Juego   -->
    <div v-if="editResource" class="flex justify-center">
      <div v-if="!editVideo">
        <div v-if="fcPathVideo(pathVideo)">
          <video class="w-100" controls :src="file(pathVideo)" style="height: 50%"></video>
        </div>
        <div v-else>
          <div class="w-100 text-center iframe-video" v-html="pathVideo"></div>
        </div>
      </div>

    </div>

  <div v-if="!editResource || editVideo">
    <div class="form-check py-1">
      <input class="form-check-input" v-model="pathVideoUrl" @input="clearData" :value="true" type="radio"
             name="inlineRadioOptions"
             id="inlineRadio1" checked="">
      <label class="form-check-label" for="inlineRadio1">Cargar Video</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" v-model="pathVideoUrl" @input="clearData" :value="false" type="radio"
             name="inlineRadioOptions"
             id="inlineRadio2">
      <label class="form-check-label" for="inlineRadio2">Agregar Iframe</label>
    </div>
    <!-- Agregar Videos -->
    <div class="mt-2">
      <p style="font-size: 12px">Formato valido MP4 y MOV</p>
      <div v-if="pathVideoUrl">
        <UploadFiles
          :uploadUrl="uploadUrl"
          :theme="theme"
          :multiple="multiple"
          :accept="accept"
          :maxSize="maxSize"
          :maxFiles="maxFiles"
          :helpText="helpText"
          :errorText="errorText"
          @fileRecords="video"
          @clearData="clearData"
          ref="uploadPicture"/>
      </div>
      <div v-else>
        <label
          for="Urlimage"
          :class="{ 'text-danger': $v.pathVideo.$error }"
          class="form-label"
        >Iframe Video <span class="text-danger">*</span>
        </label>
        <textarea rows="3" class="form-control" :class="{ 'is-invalid': $v.pathVideo.$error }" v-model="pathVideo"
                  placeholder="Iframe video"></textarea>
        <p class="text-danger font-weight-bold" v-if="$v.pathVideo.$error">El link del video es requerido, o ingrese un
          link válido.</p>
      </div>
    </div>
  </div>

  </div>
</template>

<script>
import {url, required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "AddVideo",
  data() {
    return {
      editVideo: false,
      pathVideoUrl: false,
      pathVideo: String(),

      uploadUrl: '',
      theme: '',
      multiple: false,
      accept: 'video/mp4, video/quicktime, video/mov',
      maxSize: '100MB',
      maxFiles: 1,
      helpText: 'Clic o arrastra aquí videos',
      errorText: {
        type: 'Tipo de archivo incorrecto, agrega videos',
        size: 'Esta imagen no se guardará. Las videos no deben superar los 100 MB de tamaño',
      }
    }
  },

  validations: {
    pathVideo: {required}
  },
  methods: {
    file(file) {
      const url = new URL(file, window.location.href);
      console.log(url)
      const ruta = url.pathname.split('/');
      const storage = ruta[1];
      console.log(storage)
      switch (storage) {
        case 'storage':
          return this.$config.urlBack + file
        case 'cloud':
          return this.$config.urlDigitalOcean + file;
      }

    },
    clearData() {
      // setTimeout(() => {
      //   this.pathVideo = ''
      // }, 200)
    },

    fcPathVideo(file) {
      const url = new URL(file, window.location.href);
      console.log(url)
      const ruta = url.pathname.split('/');
      const storage = ruta[1];
      switch (storage) {
        case 'storage':
          return this.$config.urlBack + file
        case 'cloud':
          return this.$config.urlDigitalOcean + file;
        case '':
          console.log('ENTRO POR ACA')
          return false
      }
    },
    video(file) {
      console.log(file)
      this.pathVideo = file[0]
    },
    editSourceVideo() {
      this.editVideo = !this.editVideo
      if (this.editVideo){
        this.$store.state.currentVideo = this.pathVideo
        console.log(this.$store.state.currentVideo)
      }else{
        this.pathVideo = this.$store.state.currentVideo
      }
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
  mounted() {
    bus.$on('validatePathVideo', () => {
      this.validation()
    })
  },
  watch: {
    dataPathVideo: function (val) {
      if (this.editResource) {
        this.pathVideo = val
      }
    },
    // immediate: true,
    pathVideo: {
      handler(val) {
        setTimeout(() => {
          this.$emit('dataResource', val)
          // this.$emit('dataVideo', val)
        }, 200)
      },
      deep: true
    },
    pathVideoUrl: {
      handler(val) {
        setTimeout(() => {
          if (!val){
            this.pathVideo = ''
          }
          this.$emit('dataVideoPathFileType', val)
        }, 200)
      },
      deep: true
    },
  }
}
</script>

<style scoped>

</style>
