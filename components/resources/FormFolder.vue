<template>
  <div>
    <div class="row mt-2">
      <div class="col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.folder.$error }">Nombre de la Carpeta
            <span class="text-danger">*</span></label>
          <input
            type="text"
            id="first-name-folder"
            class="form-control"
            placeholder="Nombres"
            v-model.trim="form.folder"
            :class="{ 'is-invalid': $v.form.folder.$error }"
            name="fname-column-folder">
          <p class="text-danger font-weight-bold" v-if="$v.form.folder.$error">El nombre de la carpeta es
            requerido.</p>
        </div>
      </div>
      <div class="col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Descripción</label>
          <textarea
            v-model="form.description"
            placeholder="Descripción"
            class="form-control" cols="8">
            </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "FormFolder",
  props: ['folder'],
  created() {
    if (this.folder) {
      this.form.folder = this.folder.folder ?? ''
      this.form.description = this.folder.description ?? ''
    }
  },
  data() {
    return {
      form: {
        folder: '',
        description: ''
      }
    }
  },
  validations: {
    form: {
      folder: {required}
    }
  },
  methods: {
    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid; // Devuelve true si los datos son válidos, false en caso contrario
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
    },
  },
  mounted() {
    bus.$on('validateForm', () => {
      this.validateData()
    })
  }
}
</script>

<style scoped>

</style>
