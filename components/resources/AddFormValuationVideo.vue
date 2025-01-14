<template>
  <div>
    <div class="row mt-2">
      <div class="col-12">

        <div class="mb-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.name.$error }"
                 for="exampleFormControlTextarea1">Nombre del Recurso <span class="text-danger">*</span></label>
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
        <div class="row">

          <div class="col-12 col-lg-6 col-md-6">

            <div class="mb-1">
              <label class="form-label" :class="{ 'text-danger': $v.form.categories.$error }"
                     for="exampleFormControlTextarea1">Categoría <span
                class="text-danger">*</span></label>
              <multiselect
                :class="{ 'is-invalid': $v.form.categories.$error }"
                v-model="form.categories"
                :options="categories"
                :searchable="true"
                :close-on-select="true"
                :custom-label="nameSelectCategory"
                track-by="id"
                :multiple="true"
                @remove="removeCategories"
                selectedLabel="Seleccionado"
                deselectLabel=""
                selectLabel="Selecciona"
                :show-labels="true"
                placeholder="Seleccionar una o varias categorías..."></multiselect>
              <p class="text-danger font-weight-bold" v-if="$v.form.categories.$error">La categoría es
                requerida.</p>
            </div>

          </div>

          <div class="col-12 col-lg-6 col-md-6">
            <!-- Tratamientos -->
            <div class="mb-1">
              <label class="form-label" :class="{ 'text-danger': $v.form.treatments.$error }"
                     for="exampleFormControlTextarea1">Relacionado con una ó varias especialidades <span
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
                @remove="removeTreatment"
                selectedLabel="Seleccionado"
                deselectLabel=""
                selectLabel="Selecciona"
                :show-labels="true"
                placeholder="Buscar especialidad..."></multiselect>
              <p class="text-danger font-weight-bold" v-if="$v.form.treatments.$error">Debe asignar una o varias
                especialidades.</p>
            </div>
          </div>

          <div class="col-lg-6 col-md-6 col-12">
            <div class="mt-0">
              <label class="form-label" :class="{ 'text-danger': $v.form.typeResourceSelected.$error }"
                     for="first-name-column">Tipo de Recurso<span
                class="text-danger">*</span></label>
              <multiselect
                :class="{ 'is-invalid': $v.form.typeResourceSelected.$error }"
                v-model="form.typeResourceSelected"
                :options="typesResource"
                :searchable="true"
                :close-on-select="true"
                :custom-label="nameSelectResource"
                track-by="id"
                selectedLabel="Seleccionado"
                deselectLabel=""
                selectLabel="Seleccionar"
                :show-labels="true"
                placeholder="Selecciona"></multiselect>
              <p class="text-danger font-weight-bold" v-if="$v.form.typeResourceSelected.$error">El tipo de recurso es
                requerido.</p>
            </div>
          </div>

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

        <!--  Contenido   -->
        <div class="mt-2">
          <!--  Agregar Documento Imagen   -->
          <AddDocumentPhoto v-if="form.typeResourceSelected?.id === 1"
                            :editResource="editResource"
                            @dataResource="dataResource"
          />

          <!--  Agregar Video   -->
          <AddVideo v-if="form.typeResourceSelected?.id === 2"
                    @dataResource="dataResource"
                    @dataVideo="dataVideo"
                    @invalidFormVideo="invalidForm"
                    :editResource="editResource"
                    :dataPathVideo="form.pathFile"
          />
        </div>

      </div>
    </div>
    <hr class="mt-2">
    <div class="row mt-1">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-secondary mx-1" @click="closeModal">Cancelar</button>
        <button class="btn btn-primary" @click="addVideo" v-if="!editResource">Agregar Recurso</button>
        <button class="btn btn-primary" @click="updateVideo" v-else>Actualizar Recurso</button>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "AddFormValuationVideo",
  data() {
    return {
      typesResource: [
        {
          id: 1,
          name: 'Documento o Imagen'
        },
        {
          id: 2,
          name: 'Video'
        }
      ],
      treatments: [],
      categories: [],
      validation: false,
      resourceFolderContentId: null,
      form: {
        name: String(),
        pathFile: String(),
        pathFileType: 'iframe',
        pathFileUrl: false,
        state: null,
        typeResourceSelected: null,
        description: String(),
        treatments: [],
        deleteTreatments: [],
        deleteCategories: [],
        folderId: this.folderId,
        categories: []
      }
    }
  },
  props: ['editResource', 'video', 'folderId'],
  validations: {
    form: {
      name: {required},
      description: {required},
      treatments: {required},
      categories: {required},
      typeResourceSelected: {required}
    }
  },
  methods: {
    removeTreatment(treatment) {
      if (this.form.deleteTreatments && typeof this.form.deleteTreatments[Symbol.iterator] === 'function') {
        this.form.deleteTreatments = [...this.form.deleteTreatments, treatment]
      } else {
        this.form.deleteTreatments = [treatment]
      }
    },
    removeCategories(category){
      if (this.form.deleteCategories && typeof this.form.deleteCategories[Symbol.iterator] === 'function') {
        this.form.deleteCategories = [...this.form.deleteCategories, category]
      } else {
        this.form.deleteCategories = [category]
      }
    },
    nameSelectResource(name) {
      return `${name.name}`
    },
    nameSelectCategory({category}) {
      return `${category}`
    },
    updateVideo() {
      this.validateForm()
      if (this.validation) return
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de actualizar el recurso?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          let form = this.formData(this.form)
          let resourceId = this.resourceFolderContentId
          let response = await this.$store.dispatch('updateVideo', {form: form, id: resourceId})
          console.log(response)
          if (response) {
            this.$vs.loading.close()
            this.$FModal.hide()
            await this.$store.dispatch('getVideosResourceFolder', this.folderId)
            this.$toast.success('Video actualizado exitosamente!');
          } else {
            this.$vs.loading.close()
            this.$toast.error('Error al actualizar el recurso.');
          }
        }
      })
    },
    invalidForm(data) {
      this.validation = data
    },
    validateForm() {

      if (!this.editResource){
        bus.$emit('validatePathVideo');
      }

      if (!this.editResource){
        bus.$emit('validatePathDocument');
      }

      this.$v.form.$touch();

      if (this.$v.$invalid) {
        this.$toast.error('Verifique los campos obligatorios.');
       return this.validation = true
      }
      this.validation = false
    },
    formData() {
      const form = new FormData()
      form.append('name', this.form.name)
      form.append('description', this.form.description)
      if (this.form.pathFileType !== 'iframe') {

        form.append('pathFile', this.form.pathFile.file)
      } else {
        form.append('pathFile', this.form.pathFile)
      }
      form.append('typeFile', this.form.pathFileType)
      form.append('pathFileIframeUrl', this.form.pathFileUrl)
      form.append('treatments', JSON.stringify(this.form.treatments))
      form.append('categories', JSON.stringify(this.form.categories))
      form.append('deleteTreatments', JSON.stringify(this.form.deleteTreatments))
      form.append('deleteCategories', JSON.stringify(this.form.deleteCategories))
      form.append('folderId', this.form.folderId)
      if (this.video) {
        form.append('fileId', this.video.id)
      }

      form.append('state', this.form.state)

      return form
    },
    //Se llama addVideo pero tambien agrega los recursos de documento y imagen
    addVideo() {
      this.validateForm()
      if (this.validation) return
      this.$swal.fire(
        this.swalAlert('¿Esta seguro de agregar el recurso?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          let form = this.formData()

          let response = await this.$store.dispatch('addVideo', form)
          if (response) {
            this.$vs.loading.close()
            this.$FModal.hide()
            await this.$store.dispatch('getVideosResourceFolder', this.folderId)
            this.$toast.success('Recurso agregado exitosamente!');
          } else {
            this.$vs.loading.close()
            this.$toast.error('Error al agregar el recurso.');
          }
        }
      })
    },
    closeModal() {
      this.$FModal.hide()
    },
    // dataVideoPathFileType(type) {
    //   this.form.pathFileType = type ? '' : 'iframe'
    //   if (!type){
    //     this.form.pathFile = ''
    //   }
    // },

    nameSelect({treatment}) {
      return `${treatment}`
    },
    getTreatments() {
      this.$axios.get('api/v1/get-treatments-actives').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las especialidades. Consulte a soporte SaludWom.");
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
      this.form.categories = video.resources_folder_content.categories


      const fileTypes = {
        video: ['mp4', 'mov', 'iframe'],
        documento: ['docx', 'pdf', 'xlsx'],
        imagen: ['png', 'jpg']
      };

      const selectedFileTypes = fileTypes.documento.includes(video.type_file)

      if (fileTypes.documento.includes(video.type_file) || fileTypes.imagen.includes(video.type_file)){

          this.form.typeResourceSelected = {
            id: 1,
            name: 'Documento o Imagen'
          }
      }

      if (fileTypes.video.includes(video.type_file)){

        this.form.typeResourceSelected = {
          id: 2,
          name: 'Video'
        }
      }

      console.log(selectedFileTypes)
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
    },

    getCategories() {
      this.$axios.get('api/v1/get-categories').then(resp => {
        this.categories = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las categorias. Consulte a soporte SaludWom.");
      })
    },

    dataResource(data) {
      if (data) {

        let dataResource = data

        this.form.pathFileType = dataResource.ext
        this.form.pathFile = dataResource

        return
      }

      this.form.pathFile = data
      this.form.pathFileType = 'iframe'

    },

    dataVideo(image) {
      this.form.pathFile = image ? image : ''
    },
  },

  mounted() {
    this.getTreatments()
    this.getCategories()
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
