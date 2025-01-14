<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <div class="mb-1">
            <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.treatment.$error }">Nombre
              Especialidad
              <span class="text-danger">*</span></label>
            <input
              type="text"
              id="first-name-column"
              class="form-control"
              placeholder="Nombre"
              v-model.trim="form.treatment"
              :class="{ 'is-invalid': $v.form.treatment.$error }"
              name="fname-column">
            <p class="text-danger font-weight-bold" v-if="$v.form.treatment.$error">El nombre de la especialidad es
              requerido.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <div class="mb-1">
            <label class="form-label" :class="{ 'text-danger': $v.form.categories.$error }"
                   for="exampleFormControlTextarea1">Categorías<span
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
              selectedLabel="Seleccionado"
              deselectLabel=""
              selectLabel="Selecciona"
              :show-labels="true"
              placeholder="Buscar categoría..."></multiselect>
            <p class="text-danger font-weight-bold" v-if="$v.form.categories.$error">Debe asignar una o varias
              categorías.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-1">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.description.$error }">Descripción
            <span class="text-danger">*</span></label>
          <textarea
            v-model="form.description"
            placeholder="Descripción"
            rows="7"
            :class="{ 'is-invalid': $v.form.description.$error }"
            class="form-control" cols="8">
            </textarea>
          <p class="text-danger font-weight-bold" v-if="$v.form.description.$error">La descripción es
            requerida.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "FormSpecialty",
  props: ['specialty'],
  created() {
    if (this.specialty) {
      this.form.treatment = this.specialty.treatment ?? ''
      this.form.categories = this.specialty.categories ?? null
      this.form.description = this.specialty.description ?? ''
    }
  },
  data() {
    return {
      categories: [],
      form: {
        treatment: '',
        description: '',
        categories: null
      }
    }
  },
  validations: {
    form: {
      treatment: {required},
      description: {required},
      categories: {required},
    }
  },
  methods: {
    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid; // Devuelve true si los datos son válidos, false en caso contrario
    },
    nameSelectCategory({name}) {
      return `${name}`
    },
    getCategoriesTreatments() {
      this.loading()
      this.$axios.get('api/v1/get-categories-treatments').then(resp => {
        this.categories = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las categorías. Consulte a soporte SaludWom.");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },
    loading() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
    },
  },
  watch: {
    form: {
      handler(val) {
        setTimeout(() => {
          if (val) {
            bus.$emit('dataForm', val);
          }
        }, 200)
      },
      deep: true
    }
  },
  mounted() {
    this.getCategoriesTreatments()
  }
}
</script>

<style scoped>

</style>
