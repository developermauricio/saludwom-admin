<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <div class="mb-1">
            <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.nameCoupon.$error }">Nombre
              o código del cupón
              <span class="text-danger">*</span></label>
            <input
              type="text"
              id="first-name-column"
              class="form-control"
              placeholder="Código"
              v-model.trim="form.nameCoupon"
              :class="{ 'is-invalid': $v.form.nameCoupon.$error }"
              name="fname-column-coupon">
            <p class="text-danger font-weight-bold" v-if="$v.form.nameCoupon.$error">El nombre o código del cupón es
              requerido.</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column" :class="{ 'text-danger': $v.form.discount.$error }">Descuento
            (El valor es en porcetataje de 1 a 100)
            <span class="text-danger">*</span></label>
          <input
            type="number"
            max="100"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Descuento"
            v-model.trim="form.discount"
            :class="{ 'is-invalid': $v.form.discount.$error }"
            name="fDescount-column-coupon">
          <p class="text-danger font-weight-bold" v-if="$v.form.discount.$error">El descuento es
            requerido.</p>
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Limite uso por usuario (Si no lo ingresas, por defecto es
            1)</label>
          <input
            type="number"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Descuento"
            v-model.trim="form.limitUsePerUser"
            name="flimitUseUser-column-coupon">
        </div>
      </div>
      <div class="col-md-6 col-12">
        <div class="mb-1">
          <label class="form-label" for="first-name-column">Limite uso por cupón (Si no lo ingresas, por defecto es
            1)</label>
          <input
            type="number"
            id="first-name-column-plan"
            class="form-control"
            placeholder="Descuento"
            v-model.trim="form.limitUsePerCoupon"
            name="flimitUseCoupon-column-coupon">
        </div>
      </div>

      <div class="col-md-6 col-12">
        <div class="mt-0">
          <label class="form-label" for="first-name-column">Fecha de Expiración (Cuando vence el cupón)</label>
          <vuejs-datepicker
            placeholder="Selecciona una fecha"
            :typeable="true"
            v-model="form.dateExpiration"
            :full-month-name="true"
            :language="es"
            format="yyyy-MM-dd"
            :disabled-dates="disabledDates"
            :bootstrap-styling="true"
          ></vuejs-datepicker>
        </div>
      </div>

      <div class="col-md-6 col-12">
        <div class="mb-1">
          <div class="mb-1">
            <label class="form-label" for="exampleFormControlTextarea1">Planes Exceptos</label>
            <multiselect
              v-model="form.exceptPlans"
              :options="plans"
              :searchable="true"
              :close-on-select="true"
              :custom-label="nameSelect"
              track-by="id"
              :multiple="true"
              selectedLabel="Seleccionado"
              deselectLabel=""
              selectLabel="Selecciona"
              :show-labels="true"
              placeholder="Buscar plan..."></multiselect>
          </div>
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
            class="form-control" cols="10" rows="6">
            </textarea>
          <p class="text-danger font-weight-bold" v-if="$v.form.description.$error">La descripción es requerida.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import {en, es} from "vuejs-datepicker/dist/locale";
import {bus} from "@/plugins/bus";

export default {
  name: "FormCoupon",
  props: ['coupon'],
  created() {
    if (this.coupon) {

      this.form.nameCoupon = this.coupon.name ?? ''
      this.form.description = this.coupon.description ?? ''
      this.form.discount = this.coupon.discount ?? ''
      this.form.createUserId = this.coupon.create_user_id ?? ''
      this.form.dateExpiration = this.coupon.date_expiration ?? ''
      this.form.limitUsePerUser = this.coupon.limit_use_per_user ?? ''
      this.form.limitUsePerCoupon = this.coupon.limit_use_per_coupon ?? ''
      this.form.exceptPlans = JSON.parse(this.coupon.except_plans) ?? null

    }
  },
  data() {
    return {
      es: es,
      en: en,
      plans: [],
      disabledDates: {
        to: new Date(), // Deshabilita todas las fechas anteriores al día de hoy
      },
      form: {
        nameCoupon: '',
        description: '',
        discount: null,
        createUserId: null,
        dateExpiration: null,
        limitUsePerUser: null,
        limitUsePerCoupon: null,
        exceptPlans: []
      }
    }
  },
  validations: {
    form: {
      nameCoupon: {required},
      description: {required},
      discount: {required},
      createUserId: {required}
    }
  },
  methods: {
    nameSelect({name}) {
      return `${name}`
    },
    validateData() {
      this.$v.form.$touch();
      return !this.$v.$invalid;
    },
    getPlans() {
      this.$axios.get('/api/v1/get-plans').then(resp => {
        this.plans = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los planes. Consulte a soporte SaludWom.");
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
    },
  },
  mounted() {
    this.form.createUserId = this.$auth.user.id
    this.getPlans()
  }
}
</script>

<style scoped>

</style>
