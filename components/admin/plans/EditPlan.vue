<template>
  <div>
    <div class="p-3">
      <h3>Editar Plan</h3>
      <FormPlan :plan="plan" ref="formPlan"/>
      <div class="row">
        <div class="col-12 d-flex justify-content-end mt-2">
          <div>
            <button class="btn btn-secondary mr-2" @click="closeModal">Cancelar</button>
          </div>
          <div>
            <button class="btn btn-primary" @click="editPlan">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "EditPlan",
  props: ['plan'],
  data(){
    return{
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
  created() {
    bus.$on('dataForm', (data) =>{
      this.form.name = data.name
      this.form.description = data.description
      this.form.price = data.price
      this.form.userId = data.userId
      this.form.numberAppointments = data.numberAppointments
      this.form.timeIntervalAppointments = data.timeIntervalAppointments
      this.form.period = data.period
      this.form.imageBackground = data.imageBackground
    })
  },
  methods: {
    closeModal() {
      this.$FModal.hide()
    },

    editPlan() {
      const isValid  = this.$refs.formPlan.validateData()

      if (!isValid){
        this.$toast.error("Verifique los datos requeridos.");
        return
      }

      this.$swal.fire(
        {
          title: '¿Esta seguro de actualizar el plan?',
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
          this.$axios.post(`api/v1/edit-plan/${this.plan.id}`, this.form).then(async resp => {
            this.$toast.success("El plan se actualizó correctamente.");
            bus.$emit('updateTableListPlans')
            this.$FModal.hide()
          }).catch(e => {

            console.log(e)
            this.$toast.error("Error al actualizar el plan. Consulte a soporte SaludWom.");
          }).finally(() =>{
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
