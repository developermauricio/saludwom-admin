<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.name.$error }">Nombre
            <span class="text-danger">*</span></label>
          <input
            type="text"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Nombre"
            v-model.trim="form.name"
            :class="{ 'is-invalid': $v.form.name.$error }"
            name="fname-column-plan">
          <p class="text-danger font-weight-bold" v-if="$v.form.name.$error">El nombre del plan es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.price.$error }">Precio
            <span class="text-danger">*</span></label>
          <input
            type="number"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Precio"
            v-model.trim="form.price"
            :class="{ 'is-invalid': $v.form.price.$error }"
            name="fprice-column-plan">
          <p class="text-danger font-weight-bold" v-if="$v.form.price.$error">El precio del plan es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.period.$error }">Período
            <span class="text-danger">*</span></label>

          <multiselect
            :class="{ 'is-invalid': $v.form.period.$error }"
            v-model="form.period"
            :options="periods"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelect"
            track-by="id"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Seleccionar"
            :show-labels="true"
            placeholder="Selecciona"></multiselect>
          <p class="text-danger font-weight-bold" v-if="$v.form.period.$error">El período es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Número de Citas</label>
          <input
            type="number"
            min="0"
            max="20"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Número de citas"
            v-model.trim="form.numberAppointments"
            name="fnumberAppointment-column-plan">
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Intervalo de citas en días</label>
          <input
            type="number"
            min="0"
            max="20"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Intervalo de citas en días"
            v-model.trim="form.timeIntervalAppointments"
            name="fnumberAppointment-column-plan">
        </div>
      </div>
      <div class="col-md-6 col-12" v-if="plan && plan.image_background">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Imagen de fondo:</label><br>
          <img :src="imageBackg(plan.image_background)" alt="" width="100">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.description.$error }">Descripción
            <span class="text-danger">*</span></label>
          <textarea
            v-model="form.description"
            placeholder="Descripción"
            :class="{ 'is-invalid': $v.form.description.$error }"
            class="form-control" cols="10" rows="8">
            </textarea>
          <p class="text-danger font-weight-bold" v-if="$v.form.description.$error">La descripción es requerida.</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Ilustración de fondo (Se recomienda que la imagen tenga un
            color tenue oscuro.</label>

          <UploadFiles
            uploadUrl=""
            theme=""
            multiple=""
            accept="image/*"
            maxSize="5MB"
            maxFiles="1"
            helpText="Clic o arrastra la imagen"
            :errorText="{
                type: 'Tipo de archivo incorrecto, agrega imagenes',
                size: 'Esta imagen no se guardará. Las imagenes no deben superar los 10 MB de tamaño',
            }"
            @fileRecords="file"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {bus} from "@/plugins/bus";

export default {
  name: "FormPlan",
  props: ['plan'],
  created() {
    if (this.plan) {
      this.form.name = this.plan.name ?? ''
      this.form.description = this.plan.description ?? ''
      this.form.price = this.plan.price ?? ''
      this.form.userId = this.plan.user_id ?? ''
      this.form.numberAppointments = this.plan.number_appointments ?? ''
      this.form.timeIntervalAppointments = this.plan.time_interval_appointments ?? ''
      this.form.period = this.periodText(this.plan.period) ?? ''
    }
  },
  data() {
    return {
      periods: [
        {id: 1, value: 'week', name: 'Semana'},
        {id: 2, value: 'month', name: 'Més'},
        {id: 3, value: 'year', name: 'Año'},
      ],
      form: {
        name: '',
        description: '',
        price: null,
        userId: this.$auth.user.id,
        numberAppointments: '0',
        timeIntervalAppointments: '0',
        period: '',
        imageBackground: '',
      }
    }
  },
  validations: {
    form: {
      name: {required},
      price: {required},
      period: {required},
      description: {required},
    }
  },
  methods: {
    imageBackg(img){

      if (img.includes('storage') || img.includes('assets')){

        return `${this.$config.urlBack}${img}`
      }

      return img
    },
    periodText(period) {
      return this.periods.find(item => item.value === period);
    },
    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid; // Devuelve true si los datos son válidos, false en caso contrario
    },
    file(file) {
      this.form.imageBackground = file[0]
    },
    nameSelect({name}) {
      return `${name}`
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
  }
}
</script>

<style scoped>

</style>
