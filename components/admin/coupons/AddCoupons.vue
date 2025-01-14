<template>
  <div>
    <div class="p-3">
      <h3>Agregar Cupón</h3>
      <FormCoupon ref="formCoupon"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="addCoupon">Agregar Cupón</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "AddCoupons",
  data() {
    return {
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
  created() {
    bus.$on('dataForm', (data) =>{
      this.form.nameCoupon = data.nameCoupon
      this.form.description = data.description
      this.form.discount = data.discount
      this.form.createUserId = data.createUserId
      this.form.dateExpiration = data.dateExpiration
      this.form.limitUsePerUser = data.limitUsePerUser
      this.form.limitUsePerCoupon = data.limitUsePerCoupon
      this.form.exceptPlans = data.exceptPlans
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },
    addCoupon() {
      const isValid = this.$refs.formCoupon.validateData()

      if (!isValid) {
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de agregar el cupón?',
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
          this.$axios.post('api/v1/add-coupon', this.form).then(async resp => {
            this.$toast.success("El cupón se agrego correctamente.");
            bus.$emit('updateTableCoupons')
            this.$FModal.hide()
          }).catch(e => {
            console.log(e)
            this.$toast.error("Error al agregar el cupón. Consulte a soporte SaludWom.");
          }).finally(() => {
            this.$vs.loading.close()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
