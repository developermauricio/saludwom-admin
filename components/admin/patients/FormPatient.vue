<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.name.$error }">Nombre
            <span class="text-danger">*</span></label>
          <input
            type="text"
            id="first-name-patient"
            class="form-control"
            placeholder="Nombres"
            v-model.trim="form.name"
            :class="{ 'is-invalid': $v.form.name.$error }"
            name="fname-column-patient">
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
            id="first-lastName-patient"
            class="form-control"
            v-model.trim="form.lastName"
            :class="{ 'is-invalid': $v.form.lastName.$error }"
            placeholder="Apellidos"
            name="lastName-patient">
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
                 id="first-email-patient"
                 class="form-control"
                 v-model.trim="form.email"
                 :class="[{ 'is-invalid': $v.form.email.$error }, {'is-invalid': validateEmailInput}]"
                 placeholder="Correo Electrónico"
                 name="email-patient">
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
          <label class="form-label" :class="{ 'text-danger': $v.form.documentType.$error }" for="first-name-column">Tipo
            de Documento<span
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
      <div class="col-md-6 col-12">
        <div class="mt-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.gender.$error }"
                 for="first-name-column">Género<span
            class="text-danger">*</span></label>
          <multiselect
            :class="{ 'is-invalid': $v.form.gender.$error }"
            v-model="form.gender"
            :options="genders"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Seleccionar"
            :show-labels="true"
            placeholder="Selecciona"></multiselect>
          <p class="text-danger font-weight-bold" v-if="$v.form.gender.$error">El género es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mt-1">
          <label class="form-label" :class="{ 'text-danger': $v.form.patientType.$error }" for="first-name-column">Tipo
            de Paciente<span
              class="text-danger">*</span></label>
          <multiselect
            :class="{ 'is-invalid': $v.form.patientType.$error }"
            v-model="form.patientType"
            :options="patientTypes"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            track-by="value"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Seleccionar"
            :show-labels="true"
            placeholder="Selecciona"></multiselect>
          <p class="text-danger font-weight-bold" v-if="$v.form.patientType.$error">El tipo de paciente es
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
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Selecciona"
            :show-labels="true"
            placeholder="Buscar ciudad..."></multiselect>
        </div>
      </div>
    </div>
    <div v-if="!patient">
      <hr class="mt-4">
      <p>Opcionalmente, puedes asignar una suscripción para que el paciente inicie su objetivo.</p>
      <div class="row">
        <div class="col-12 col-md-5 col-lg-5">
          <div class="mt-0">
            <label class="form-label" for="first-name-column">Selecciona un plan</label>
            <multiselect
              v-model="form.plan"
              :options="plans"
              :searchable="true"
              :close-on-select="true"
              :custom-label="nameSelect"
              track-by="id"
              selectedLabel="Seleccionado"
              deselectLabel=""
              selectLabel="Selecciona"
              :show-labels="true"
              placeholder="Buscar plan..."></multiselect>
          </div>
        </div>
        <div class="col-12 col-md-7 col-lg-7">
          <div class="mb-1">
            <label class="form-label" for="first-name-column">Observación. (Se agrega en la suscripción y en la
              orden)</label>
            <textarea
              v-model="form.observations"
              placeholder="Observación"
              class="form-control" cols="8">
            </textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {en, es} from "vuejs-datepicker/dist/locale";
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "FormPatient",
  props: ['patient'],
  created() {
    if (this.patient) {
      this.form.name = this.patient.name ?? ''
      this.form.lastName = this.patient.lastName ?? ''
      this.form.email = this.patient.email ?? ''
      this.form.document = this.patient.document ?? ''
      this.form.documentType = this.patient.documentType ?? ''
      this.form.gender = this.patient.gender ?? ''
      this.form.patientType = this.patient.patientType === 'courtesy' ? {
        value: 'courtesy',
        name: 'Cortesía'
      } : {value: 'client', name: 'Cliente'}
      this.form.birthday = this.patient.birthday ?? ''
      this.form.phone = this.patient.phone ?? ''
      this.form.city = this.patient.city ?? ''
      this.form.country = this.patient.country ?? ''
      this.form.address = this.patient.address ?? ''
    }
  },
  data() {
    return {
      es: es,
      en: en,
      validateEmailInput: false,
      countries: [],
      cities: [],
      documentTypes: [],
      genders: [],
      plans: [],

      patientTypes: [
        {
          value: 'courtesy',
          name: 'Cortesía',
        },
        {
          value: 'client',
          name: 'Cliente',
        },
      ],

      form: {
        name: '',
        lastName: '',
        email: '',
        document: '',
        documentType: null,
        gender: null,
        patientType: null,
        birthday: null,
        phone: '',
        phoneI: '',
        city: null,
        country: null,
        address: '',
        plan: null,
        observations: ''
      }
    }
  },
  validations: {
    form: {
      name: {required},
      lastName: {required},
      email: {required},
      document: {required},
      documentType: {required},
      gender: {required},
      patientType: {required},
      birthday: {required},
      phone: {required},
    }
  },
  methods: {
    nameSelect({name}) {
      return `${name}`
    },

    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid; // Devuelve true si los datos son válidos, false en caso contrario
    },

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

    getGenders() {
      this.$axios.get('api/v1/get-genders').then(resp => {
        this.genders = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los generos. Consulte a soporte SaludWom.");
      })
    },

    getPlans() {
      this.$axios.get('/api/v1/get-plans').then(resp => {
        this.plans = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los planes. Consulte a soporte SaludWom.");
      })
    },

    loading() {
      this.$vs.loading({
        color: process.env.COLOR_BASE,
        text: 'Espere por favor...'
      })
    },

    async validateEmail(email) {
      await this.$axios.get(`/api/v1/verify-email-user/${email}/${this.patient ? this.patient.user.id : null}`).then(resp => {
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
    this.getGenders()
    this.getPlans()

    bus.$on('validateForm', () => {
      this.validateData()
    })
  }
}
</script>
<style scoped>

</style>
