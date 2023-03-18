<template>
  <div>
    <div class="row">
      <div class="col-12">
        <CardCountPatients :items="countItems"/>
      </div>
    </div>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TablePatients :patients.sync="patients" @searchPatients="searchPatients" @filters="filters" @updateGetPatients="getPatients"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientsDoctor",
  data() {
    return {
      valueFilterGender: '',
      valueFilterType: '',
      messageIsPatients: false,
      patients: [],
      countItems: []
    }
  },
  methods: {
    searchPatients(data) {
      this.patients = data
    },
    async getPatients() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-patients-doctor/?genderId=${this.valueFilterGender}&type=${this.valueFilterType}`).then(resp => {
        this.patients = resp.data.data
        this.countItems = resp.data.countData
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
    filters(data){
      this.valueFilterGender = data.valueGender ?? ''
      this.valueFilterType = data.valueType ?? ''
      setTimeout(() =>{
        this.getPatients()
      }, 200)
    },
  },
  mounted() {
    this.getPatients()
    // this.getCountPatients()
  }
}
</script>

<style scoped>

</style>
