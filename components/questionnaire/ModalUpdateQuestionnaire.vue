<template>
  <div class="p-3">
    <div class="d-flex justify-content-between">
      <h2 class="mb-2" v-role="'Admin'">Actualizar Cuestionario <span class="text-primary">"{{
          questionnaire.name
        }}"</span></h2>
      <h2 class="mb-2" v-role="'Doctor'"><span class="text-primary">"{{ questionnaire.name }}"</span></h2>
      <div class="pl-5" v-role="'Admin'">
        <a href="#" @click="updateState()"><span
          :class="`badge bg-${stateColor(questionnaire.state)}`">{{ stateTitle(questionnaire.state) }}</span></a>
        <p class="m-0" style="font-size: 13px">Clic para cambiar el estado</p>
      </div>
    </div>
    <div v-role="'Admin'">
      <div class="row">
        <div class="col-12">
          <!--  Nombre del cuestionario -->
          <div class="mb-1">
            <label class="form-label" :class="{ 'text-danger': $v.form.nameQuestionnaire.$error }"
                   for="exampleFormControlTextarea1">Nombre del Cuestionario <span class="text-danger">*</span></label>
            <input class="form-control" :class="{ 'is-invalid': $v.form.nameQuestionnaire.$error }"
                   v-model="form.nameQuestionnaire" placeholder="Nombre">
            <p class="text-danger font-weight-bold" v-if="$v.form.nameQuestionnaire.$error">El nombre del cuestionario
              es requerido.</p>
          </div>
          <!-- Descripción -->
          <div class="mb-1">
            <label class="form-label" :class="{ 'text-danger': $v.form.descriptionQuestionnaire.$error }"
                   for="exampleFormControlTextarea1">Descripción <span
              class="text-danger">*</span></label>
            <textarea class="form-control" :class="{ 'is-invalid': $v.form.descriptionQuestionnaire.$error }"
                      v-model="form.descriptionQuestionnaire" id="exampleFormControlTextarea1"
                      rows="3" placeholder="Descripción"></textarea>
            <p class="text-danger font-weight-bold" v-if="$v.form.descriptionQuestionnaire.$error">La descripción es
              requerida.</p>
          </div>
          <div class="row">
            <div class="col-md-6 col-12">
              <!-- Especialidades -->
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
                  @remove="removeTreatment"
                  :multiple="true"
                  selectedLabel="Seleccionado"
                  deselectLabel=""
                  selectLabel="Selecciona"
                  :show-labels="true"
                  placeholder="Buscar especialidad..."></multiselect>
                <p class="text-danger font-weight-bold" v-if="$v.form.treatments.$error">Debe asignar una o varias
                  especialidades.</p>
              </div>
            </div>
            <div class="col-md-6 col-12">

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
          </div>
        </div>
      </div>
      <hr>


      <!--=====================================
          PREGUNTAS CUESTIONARIO
      ======================================-->
      <FormAddQuestion/>
    </div>
    <!--=====================================
       LISTA Y PREVIEW DEL CUESTIONARIO
   ======================================-->
      <ListQuestionsQuestionnaires :isAdd="false" :questions="questionnaire.questions" :questionnaire="questionnaire"/>
    <!--=====================================
       FOOTER
   ======================================-->
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary mr-2" @click="closeModal">Cerrar</button>
          <button class="btn btn-primary" @click="updateQuestionnaire" v-role="'Admin'">Actualizar Cuestionario</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "ModalUpdateQuestionnaire",
  data() {
    return {
      form: {
        nameQuestionnaire: '',
        descriptionQuestionnaire: '',
        treatments: [],
        questions: [],
        categories: []
      },
      treatments: [],
      categories: []
    }
  },
  props: ['questionnaire'],
  validations: {
    form: {
      nameQuestionnaire: {required},
      descriptionQuestionnaire: {required},
      treatments: {required},
      categories: {required},
    }
  },
  beforeMount() {
    this.$store.commit('SET_SOLVED_QUESTIONNAIRE', this.questionnaire.solved)
    setTimeout(() => {
      //Datos de entrada del formulario
      this.form.nameQuestionnaire = this.questionnaire.name
      this.form.descriptionQuestionnaire = this.questionnaire.description
      this.form.treatments = this.questionnaire.treatments
      this.form.categories = this.questionnaire.categories
      //Datos de las preguntas
      this.$store.state.app.questionnaire.questions = this.questionnaire.questions
    }, 100)
  },
  methods: {
    nameSelectCategory({category}) {
      return `${category}`
    },
    removeTreatment(treatment){
      setTimeout(() =>{
        this.$store.commit('SED_ADD_DELETE_TREATMENTS_IN_QUESTIONNAIRE', treatment)
      }, 500)

    },
    removeCategories(category){
      setTimeout(() =>{
        this.$store.commit('SED_ADD_DELETE_CATEGORIES_IN_QUESTIONNAIRE', category)
      }, 500)

    },
    updateQuestionnaire() {
      this.$v.form.$touch();
      if (this.$v.$invalid) {
        return
      }
      if (this.$store.state.app.questionnaire.questions.length === 0) {
        this.$toast.error("Debe agregar preguntas.");
        return;
      }
      this.$swal.fire(
        {
          title: '¿Esta seguro de actualizar el cuestionario?',
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'No',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary mr-2'
          },

          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          this.$axios.post(`api/v1/update-questionnaire/${this.questionnaire.id}`, this.$store.state.app.questionnaire).then(async resp => {
            await this.$store.dispatch('ACTION_CLEAR_DATA_QUESTIONNAIRE')
            this.$toast.success("El cuestionario se actualizó correctamente.");
            bus.$emit('updateTableQuestionnaire');
            this.$vs.loading.close()
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Hubo un error, puede ser que la pregunta ya tiene una respuesta dada por algún paciente. Consulte a soporte SaludWom.");
          })
        }
      })
    },
    async closeModal() {
      await this.$store.dispatch('ACTION_CLEAR_DATA_QUESTIONNAIRE')
      this.$FModal.hide()
    },
    stateColor(state) {
      switch (state) {
        case '1':
          return 'success'
        case '2':
          return 'danger'
      }
    },
    stateTitle(state) {
      switch (state) {
        case '1':
          return 'Activo'
        case '2':
          return 'Inactivo'
      }
    },
    nameSelect({treatment}) {
      return `${treatment}`
    },
    updateState() {
      let state = null
      if (this.questionnaire.state === '1') {
        state = '2'
      } else {
        state = '1'
      }
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      this.$axios.post(`api/v1/update-state-questionnaire/${this.questionnaire.id}/${state}`).then(resp => {
        this.questionnaire.state = state
        this.$toast.success("El estado del cuestionario se actualizó correctamente.");
        bus.$emit('updateTableQuestionnaire');
        this.$vs.loading.close()
        state = null
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener al actualizar el estado. Consulte a soporte SaludWom.");
      })
    },
    getTreatments() {
      this.$axios.get('api/v1/get-treatments-actives').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las especialidades. Consulte a soporte SaludWom.");
      })
    },
    getCategories() {
      this.$axios.get('api/v1/get-categories').then(resp => {
        this.categories = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las categorias. Consulte a soporte SaludWom.");
      })
    }
  },

  mounted() {
    this.getTreatments()
    this.getCategories()
  },
  watch: {
    'form.nameQuestionnaire': function (val) {
      this.$store.commit('SET_NAME_QUESTIONNAIRE', val)
    },
    'form.descriptionQuestionnaire': function (val) {
      this.$store.commit('SET_DESCRIPTION_QUESTIONNAIRE', val)
    },
    'form.treatments': function (val) {
      this.$store.commit('SET_TREATMENT_QUESTIONNAIRE', val)
    },
    'form.categories': function (val) {
      this.$store.commit('SET_CATEGORIES_QUESTIONNAIRE', val)
    }
  }
}
</script>

<style scoped>

</style>
