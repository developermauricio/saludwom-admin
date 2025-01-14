<template>
  <div>
    <CardInfoPatients  :countDataInfo="countItems"/>
    <div class="row" id="table-striped">
      <div class="col-12" v-role="'Admin'">
        <TablePatients :patients.sync="patients"
                       :messageIsPatients="messageIsPatients"
                       @datefilterNull="datefilterNull"
                       @searchPatients="searchPatients"
                       @filters="filters"
                       @filterDate="filterDate"
                       @updateGetPatients="getPatients"/>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "PatientsAdmin",
  data() {
    return {
      valueFilterType: '',
      valueFilterGender: '',
      valueFilterDocumentType: '',
      valueFilterState: '',
      valueFilterHasSubscription: '',
      messageIsPatients: false,
      patients: [],
      dateFilter: null,
      countItems: []
    }
  },
  created() {
    setTimeout(() =>{
      bus.$on('updateTableListPatient', () => {
        this.getPatients();
      })
    }, 200)
  },
  methods: {

    filterDate(date) {
      setTimeout(() => {
        this.dateFilter = date
        this.getPatients()
      }, 200)
    },

    datefilterNull() {
      this.dateFilter = null
    },

    searchPatients(data) {
      this.patients = data
    },

    async getPatients() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-patients-admin/${JSON.stringify(this.dateFilter)}/?type=${this.valueFilterType}&state=${this.valueFilterState}&gender=${this.valueFilterGender}&documentType=${this.valueFilterDocumentType}&hasSubscription=${this.valueFilterHasSubscription}`).then(resp => {

        this.patients = resp.data.data
        this.countItems = resp.data.countData

        if (this.patients.length === 0) {
          this.messageIsPatients = true
        }
        this.$vs.loading.close()
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Eror al obtener los datos de los pacientes. Consulte a soporte SaludWom");
        return
      })
    },

    filters(data) {

      this.valueFilterType = data.valueType ?? ''
      this.valueFilterGender = data.valueGender ?? ''
      this.valueFilterDocumentType = data.valueDocumentType ?? ''
      this.valueFilterState = data.valueState ?? ''
      this.valueFilterHasSubscription = data.valueHasSubscription ?? ''
      setTimeout(() => {
        this.getPatients()
      }, 200)
    },
  },
  mounted() {
    this.getPatients()
  }
}
</script>

<style scoped>

</style>
