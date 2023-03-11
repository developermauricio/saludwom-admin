<template>
  <div>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TablePatients :patients.sync="patients" @updateGetPatients="getPatients"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientsAdmin",
  data(){
    return{
      messageIsPatients:false,
      patients: []
    }
  },
  methods:{
    async getPatients() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-patients`).then(resp => {

        this.patients = resp.data.data
        if (this.patients.length === 0) {
          this.messageIsPatients = true
        }
        this.$vs.loading.close()
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Al obtener los datos de los pacientes. Consulte con el administrador");
        return
      })
    },
  },
  mounted() {
    this.getPatients()
  }
}
</script>

<style scoped>

</style>
