<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.name.$error }">Nombre
            <span class="text-danger">*</span></label>
          <input
            type="text"
            id="first-name-column"
            class="form-control"
            placeholder="Nombres"
            v-model.trim="form.name"
            :class="{ 'is-invalid': $v.form.name.$error }"
            name="fname-column">
          <p class="text-danger font-weight-bold" v-if="$v.form.name.$error">El nombre es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.lastName.$error }">Apellidos
            <span class="text-danger">*</span></label>
          <input
            type="text"
            id="first-lastName-column"
            class="form-control"
            v-model.trim="form.lastName"
            :class="{ 'is-invalid': $v.form.lastName.$error }"
            placeholder="Apellidos"
            name="lastName">
          <p class="text-danger font-weight-bold" v-if="$v.form.lastName.$error">El apellido es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.email.$error }">Correo
            Electrónico <span
              class="text-danger">*</span></label>
          <input type="text"
                 id="first-name-column"
                 class="form-control"
                 v-model.trim="form.email"
                 :class="[{ 'is-invalid': $v.form.email.$error }, {'is-invalid': validateEmailInput}]"
                 placeholder="Correo Electrónico"
                 name="email">
          <p class="text-danger font-weight-bold" v-if="$v.form.email.$error">El correo electrónico es
            requerido.</p>
          <p class="text-danger font-weight-bold" v-if="validateEmailInput">El correo electrónico ya ha sido
            registrado, por favor ingrese otro.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mt-0">
          <label class="form-label" :class="{ 'text-danger': $v.form.phone.$error }"
                 for="first-name-column">Teléfono<span
            class="text-danger">*</span></label>
          <vue-phone-number-input
            v-model="form.phone"
            color="#D85C72"
            @update="form.phoneI=$event.formatInternational"
            :class="{ 'is-invalid': $v.form.phone.$error }"
            :translations="{
  countrySelectorLabel: 'Código del país',
  countrySelectorError: 'Seleccione un país',
  phoneNumberLabel: 'Número de teléfono',
  example: 'Ejemplo :'
}"
          />
          <p class="text-danger font-weight-bold" v-if="$v.form.phone.$error">El teléfono es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mt-0">
          <label class="form-label" :class="{ 'text-danger': $v.form.documentType.$error }" for="first-name-column">Tipo de Documento<span
            class="text-danger">*</span></label>
          <multiselect
            :class="{ 'is-invalid': $v.form.documentType.$error }"
            v-model="form.documentType"
            :options="documentTypes"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Seleccionar"
            :show-labels="true"
            placeholder="Selecciona"></multiselect>
          <p class="text-danger font-weight-bold" v-if="$v.form.documentType.$error">El tipo de documento es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mt-0">
          <label class="form-label" :class="{ 'text-danger': $v.form.document.$error }" for="first-name-column">Nº
            Documento<span
              class="text-danger">*</span></label>
          <input
            class="form-control"
            type="text"
            :class="{ 'is-invalid': $v.form.document.$error }"
            v-model.trim="form.document"
            placeholder="">
          <p class="text-danger font-weight-bold" v-if="$v.form.document.$error">El documento es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12 mt-1">
        <div class="mt-0">
          <label class="form-label" :class="{ 'text-danger': $v.form.birthday.$error }" for="first-name-column">Fecha
            de Nacimiento<span
              class="text-danger">*</span></label>
          <vuejs-datepicker
            placeholder="Selecciona una fecha"
            :input-class="{ 'is-invalid': $v.form.birthday.$error }"
            :typeable="true"
            v-model="form.birthday"
            :full-month-name="true"
            :language="es"
            format="yyyy-MM-dd"
            :bootstrap-styling="true"
          ></vuejs-datepicker>
          <p class="text-danger font-weight-bold" v-if="$v.form.birthday.$error">La fecha de nacimiento es
            requerida.</p>
        </div>
      </div>
      <div class="col-md-6 col-12 mt-1">
        <div class="mt-0">
          <label class="form-label" for="first-name-column">Dirección (Opcional)</label>
          <input
            class="form-control"
            type="text"
            v-model.trim="form.address"
            placeholder="">
        </div>
      </div>

      <div class="col-md-6 col-12 mt-1">
        <div class="mt-0">
          <label class="form-label" for="first-name-column">País (Opcional)</label>
          <multiselect
            v-model="form.country"
            :options="countries"
            :searchable="true"
            :close-on-select="true"
            @input="getCitiesFromCountry"
            :custom-label="nameSelect"
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Selecciona"
            :show-labels="true"
            placeholder="Buscar país..."></multiselect>
        </div>
      </div>
      <div class="col-md-6 col-12 mt-1">
        <div class="mt-0">
          <label class="form-label" for="first-name-column">Ciudad (Opcional)</label>
          <multiselect
            v-model="form.city"
            :options="cities"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            @input="selectedCity"
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Selecciona"
            :show-labels="true"
            placeholder="Buscar ciudad..."></multiselect>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mt-2">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.biography.$error }">Biografía
            <span class="text-danger">*</span></label>
          <textarea
            v-model="form.biography"
            placeholder="Biografía"
            :class="{ 'is-invalid': $v.form.biography.$error }"
            class="form-control" cols="8">
            </textarea>
          <p class="text-danger font-weight-bold" v-if="$v.form.biography.$error">La biografía es
            requerida.</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-8">
        <!-- Tratamientos -->
        <div class="mb-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.treatments.$error }"
                 for="exampleFormControlTextarea1">Especialidades<span
            class="text-danger">*</span></label>
          <multiselect
            :class="{ 'is-invalid': $v.form.treatments.$error }"
            v-model="form.treatments"
            :options="treatments"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelectTreatment"
            track-by="id"
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
    </div>
    <hr>
    <div class="row">
      <div class="my-1">
        <h5>Api conexión Zoom</h5>
      </div>
      <div class="col-md-6 col-lg-6">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Zoom Api Key </label>
          <input
            type="text"
            id="first-name-column"
            class="form-control"
            placeholder="Api key"
            v-model.trim="form.zoomApiKey"
            name="fname-column">
        </div>
      </div>
      <div class="col-md-6 col-lg-6">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Zoom Api Secret </label>
          <input
            type="text"
            id="first-name-column"
            class="form-control"
            placeholder="Api Secret"
            v-model.trim="form.zoomApiSecret"
            name="fname-column">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {en, es} from "vuejs-datepicker/dist/locale";
import {bus} from "../../../plugins/bus";

export default {
  name: "FormDoctor",
  props: ['doctor'],
  created() {
    if (this.doctor){
      this.form.name = this.doctor.name ?? ''
      this.form.lastName = this.doctor.lastName ?? ''
      this.form.email = this.doctor.email ?? ''
      this.form.phone = this.doctor.phone ?? ''
      this.form.documentType = this.doctor.documentType ?? null
      this.form.document = this.doctor.document ?? ''
      this.form.birthday = this.doctor.birthday ?? null
      this.form.address = this.doctor.address ?? ''
      this.form.country = this.doctor.country ?? null
      this.form.city = this.doctor.city ?? null
      this.form.biography = this.doctor.biography ?? ''
      this.form.treatments = this.doctor.treatments ?? null
      this.form.zoomApiKey = this.doctor.zoomApiKey ?? ''
      this.form.zoomApiSecret = this.doctor.zoomApiSecret ?? ''
    }

  },
  data() {
    return {
      es: es,
      en: en,

      validateEmailInput: false,
      treatments: [],
      countries: [],
      cities: [],
      documentTypes: [],
      form: {
        name: '',
        zoomApiKey: '',
        zoomApiSecret: '',
        lastName: '',
        email: '',
        birthday: null,
        phone: '',
        phoneI: '',
        biography: '',
        city: null,
        documentType: null,
        document: '',
        address: '',
        country: null,
        treatments: null,
      },
    }
  },
  validations: {
    form: {
      name: {required},
      lastName: {required},
      email: {required},
      phone: {required},
      document: {required},
      documentType: {required},
      birthday: {required},
      biography: {required},
      treatments: {required},
    },
  },
  methods: {
    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid; // Devuelve true si los datos son válidos, false en caso contrario
    },
    nameSelect({name}) {
      return `${name}`
    },
    nameSelectTreatment({treatment}) {
      return `${treatment}`
    },
    /*Obtener todos los pais*/
    async getCountries() {
      await this.$axios.get('/api/v1/get-countries').then(resp => {
        this.countries = resp.data.data
        this.$vs.loading.close()
      }).catch((e) => {
        console.log('ERROR', e);
        this.$toast.error("Error al obtener los paises. Consulte a soporte SaludWom")
        this.$vs.loading.close()
      })
    },
    /*Obtener todos los pais*/
    async getCitiesFromCountry(country) {
      this.loading()
      this.$emit('selectCountry', this.country)
      await this.$axios.get(`/api/v1/get-cities-from-country/${country.alpha2Code}`).then(resp => {
        this.cities = resp.data.data
        this.$vs.loading.close()
      }).catch((e) => {
        console.log('ERROR', e);
        this.$toast.error("Error al obtener las ciudades. Consulte a soporte SaludWom")
        this.$vs.loading.close()
      })
    },
    async getDocumentType() {
      await this.$axios.get('/api/v1/get-document-types').then(resp => {
        this.documentTypes = resp.data.data
      }).catch(e => {
        console.log('ERROR AL OBTENER LOS TIPOS DE DOCUMENTO', e)
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
    selectedCity(city) {
      console.log(city);
    },
    loading() {
      this.$vs.loading({
        color: process.env.COLOR_BASE,
        text: 'Espere por favor...'
      })
    },
    async validateEmail(email) {
      await this.$axios.get(`/api/v1/verify-email-user/${email}/${this.doctor ? this.doctor.userId : null}`).then(resp => {
        if (resp.data.data !== 300) {
          this.validateEmailInput = true
        }
      }).catch(e => {
        console.log('ERROR', e);
        this.$toast.error("Error al verificar el correo electrónico. Consulte a soporte SaludWom.");
      });
      this.$vs.loading.close()
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
    'form.email': function (val) {
      if (val) {
        this.validateEmailInput = false
        if (this.time) {
          clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
          this.loading()
          this.validateEmail(val)
        }, 1000);

      }
    },
  },
  mounted() {
    this.getDocumentType()
    this.getCountries()
    this.getTreatments()

    bus.$on('validateForm', () => {
      this.validateData()
    })
  }
}
</script>

<style scoped>

</style>
