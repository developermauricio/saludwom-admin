<template>
  <div>
    <CardInfoStateValoration :countDataStateValoration.sync="countItems"/>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TableValorations :valorations.sync="valorations" :messageIsValuations="messageIsValuations"
                          @searchPatients="searchValorations"
                          @datefilterNull="datefilterNull"
                          @filters="filters"
                          @filterDate="filterDate"
                          @updateGetPatients="getValorations"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ValorationsDoctor",
  data() {
    return {
      valueFilterGender: '',
      valueFilterPlan: '',
      valueFilterState: '',
      messageIsValuations: false,
      dateFilter: null,
      valorations: [],
      countItems: []
    }
  },
  methods: {
    filterDate(date){
      setTimeout(() =>{
        this.dateFilter = date
        this.getValorations()
      }, 200)
    },
    datefilterNull(){
      this.dateFilter = null
    },
    searchValorations(data) {
      this.valorations = data
    },
    async getValorations() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-valorations-doctor/${JSON.stringify(this.dateFilter)}/?genderId=${this.valueFilterGender}&state=${this.valueFilterState}&plan=${this.valueFilterPlan}`).then(resp => {
        this.valorations = resp.data.data
        this.countItems = resp.data.countDataState
        this.$vs.loading.close()
        if (this.valorations.length === 0) {
          return this.messageIsValuations = true
        }
        this.messageIsValuations = false
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Error al obtener los objetivos. Consulte a soporte SaludWom");
        return
      })
    },
    filters(data) {
      this.valueFilterGender = data.valueGender ?? ''
      this.valueFilterPlan = data.valuePlan ?? ''
      this.valueFilterState = data.valueState ?? ''
      setTimeout(() => {
        this.getValorations()
      }, 200)
    },
  },
  mounted() {
    this.getValorations()
  }
}
</script>

<style scoped>

</style>
