<template>
  <div>
    <div class="p-3">
      <h3>Editar Cupón</h3>
      <FormCoupon :coupon="coupon" ref="formCoupon"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="editCoupon">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "EditCoupon",
  props: ['coupon'],
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
    editCoupon() {

      const isValid  = this.$refs.formCoupon.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de editar la información del cupón?',
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
          this.$axios.post(`api/v1/edit-coupon/${this.coupon.id}`, this.form).then(async resp => {
            this.$toast.success("El cupón se actualizó correctamente.");
            this.$vs.loading.close()
            bus.$emit('updateTableCoupons')
            this.$FModal.hide()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al actualizar el cupón. Consulte a soporte SaludWom.");
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
