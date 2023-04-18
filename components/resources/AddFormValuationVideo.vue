<template>
  <div>
    <div class="row mt-2">
      <div class="col-12">
        <!--  Nombre del cuestionario -->
        <div class="mb-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.name.$error }"
                 for="exampleFormControlTextarea1">Nombre del Video <span class="text-danger">*</span></label>
          <input class="form-control" :class="{ 'is-invalid': $v.form.name.$error }" v-model="form.name"
                 placeholder="Nombre">
          <p class="text-danger font-weight-bold" v-if="$v.form.name.$error">El nombre del video es requerido.</p>
        </div>
        <!-- Descripción -->
        <div class="mb-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.description.$error }"
                 for="exampleFormControlTextarea1">Descripción <span
            class="text-danger">*</span></label>
          <textarea class="form-control" :class="{ 'is-invalid': $v.form.description.$error }"
                    v-model="form.description" id="exampleFormControlTextarea1"
                    rows="3" placeholder="Descripción"></textarea>
          <p class="text-danger font-weight-bold" v-if="$v.form.description.$error">La descripción es
            requerida.</p>
        </div>
        <!-- Tratamientos -->
        <div class="mb-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.treatments.$error }"
                 for="exampleFormControlTextarea1">Relacionado con uno varios tratamientos <span
            class="text-danger">*</span></label>
          <multiselect
            :class="{ 'is-invalid': $v.form.treatments.$error }"
            v-model="form.treatments"
            :options="treatments"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            track-by="id"
            :multiple="true"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Selecciona"
            :show-labels="true"
            placeholder="Buscar tratamiento..."></multiselect>
          <p class="text-danger font-weight-bold" v-if="$v.form.treatments.$error">Debe asignar uno o varios
            tratamientos.</p>
        </div>
        <!--  Input TOOGLE   -->
        <div class="py-2" v-if="editResource">
          <label class="form-label"
                 for="exampleFormControlTextarea1">Estado</label>
          <div class="form-check form-switch">
            <input class="form-check-input" v-model="form.state" id="flexSwitchCheckChecked" type="checkbox">
            <label class="form-check-label"
                   for="flexSwitchCheckChecked">{{ form.state ? 'Disponible' : 'No Disponible' }}</label>
          </div>
        </div>
        <!--  Agregar Imagen   -->
        <AddVideo @dataVideo="dataVideo" @invalidFormVideo="invalidForm" :editResource="editResource"
                  :dataPathVideo="form.pathFile" @dataVideoUrl="dataVideoUrl"/>

      </div>
    </div>
    <hr class="mt-2">
    <div class="row mt-1">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-secondary mx-1" @click="closeModal">Cancelar</button>
        <button class="btn btn-primary" @click="addVideo" v-if="!editResource">Agregar Video</button>
        <button class="btn btn-primary" @click="updateVideo" v-else>Actualizar Video</button>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "../../plugins/bus";

export default {
  name: "AddFormValuationVideo",
  data() {
    return {
      treatments: [],
      validation: false,
      resourceFolderContentId: null,
      form: {
        name: String(),
        pathFile: String(),
        pathFileType: String(),
        pathFileUrl: false,
        state: null,
        description: String(),
        treatments: [],
        folderId: this.folderId
      }
    }
  },
  props: ['editResource', 'video', 'folderId'],
  validations: {
    form: {
      name: {required},
      description: {required},
      treatments: {required},
    }
  },
  methods: {
    updateVideo() {
      this.validateForm()
      if (this.validation) return
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de actualizar el video?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          let form = this.formData(this.form)
          let resourceId = this.resourceFolderContentId
          let response = await this.$store.dispatch('updateVideo', {form: form, id: resourceId})
          if (response) {
            this.$vs.loading.close()
            this.$FModal.hide()
            await this.$store.dispatch('getVideosResourceFolder', this.folderId)
            this.$toast.success('Video actualizado exitosamente!');
          } else {
            this.$vs.loading.close()
            this.$toast.error('Error al actualizar el video.');
          }
        }
      })
    },
    invalidForm(data) {
      this.validation = data
    },
    validateForm() {
      bus.$emit('validatePathVideo');
      this.$v.form.$touch();
      if (this.$v.$invalid) {
        this.$toast.error('Verifique los campos obligatorios.');
        this.validation = true
      }
    },
    formData() {
      const form = new FormData()
      form.append('name', this.form.name)
      form.append('description', this.form.description)
      if (this.form.pathFileUrl === true) {
        form.append('pathFile', this.form.pathFile.file)
      } else {
        form.append('pathFile', this.form.pathFile)
      }
      form.append('typeFile', this.form.pathFileType)
      form.append('pathFileIframeUrl', this.form.pathFileUrl)
      form.append('treatments', JSON.stringify(this.form.treatments))
      form.append('folderId', this.form.folderId)
      if (this.video) {
        form.append('fileId', this.video.id)
      }

      form.append('state', this.form.state)

      return form
    },
    addVideo() {
      this.validateForm()
      if (this.validation) return
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de agregar el video?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          let form = this.formData()
          console.log('ESTE ES EL FORM ', form)
          let response = await this.$store.dispatch('addVideo', form)
          if (response) {
            this.$vs.loading.close()
            this.$FModal.hide()
            await this.$store.dispatch('getVideosResourceFolder', this.folderId)
            this.$toast.success('Video agregado exitosamente!');
          } else {
            this.$vs.loading.close()
            this.$toast.error('Error al agregar el video.');
          }
        }
      })
    },
    closeModal() {
      this.$FModal.hide()
    },
    dataVideo(image) {
      this.form.pathFile = image ? image : ''
    },
    dataVideoUrl(data) {
      this.form.pathFileUrl = data
    },
    nameSelect({treatment}) {
      return `${treatment}`
    },
    getTreatments() {
      this.$axios.get('api/v1/get-treatments').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los tratamientos. Consulte a soporte SaludWom.");
      })
    },
    dataEditVideo(video) {
      console.log(video)
      this.form.name = video.resources_folder_content.name
      this.form.description = video.resources_folder_content.description
      this.form.treatments = video.resources_folder_content.treatments
      this.form.pathFile = video.path_file
      this.form.pathFileType = video.type_file
      this.form.folderId = this.folderId
      this.form.state = video.resources_folder_content.state === '1' ? true : false
    },
    /*=============================================
    FUNCIÓN PARA LAS OPCIONES DE LA ALERTA DE CONFIRMACIÓN
   =============================================*/
    swalAlert(message, icon, textAccept, textCancel) {
      return {
        title: message,
        icon: icon,
        confirmButtonText: textAccept,
        cancelButtonText: textCancel,
        customClass: {
          confirmButton: 'btn btn-primary mx-1',
          cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: false,
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
      }
    }
  },
  mounted() {
    this.getTreatments()
    if (this.editResource) {
      console.log(this.video)
      this.resourceFolderContentId = this.video.resources_folder_content.id
      this.dataEditVideo(this.video)
    }
  }
}
</script>

<style scoped>

</style>
