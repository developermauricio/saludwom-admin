<template>
    <div>
      <CardInfoStateSubscriptions :countDataStateSubscription.sync="countItems"/>
      <div class="row" id="table-striped">
        <div class="col-12">
          <TableSubscriptions
            @filters="filters"

            @filterDate="filterDate"
            @datefilterNull="datefilterNull"
            @searchSubscriptions="searchSubscriptions"
            @updateGetSubscriptions="getSubscriptions"
            :subscriptions.async="subscriptions"
            :messageIsSubscriptions="messageIsSubscriptions"
          />
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "ListSubscriptions",
  data() {
    return {
      valueFilterPlan: '',
      valueFilterState: '',
      valueTabPosition: 0,
      messageIsSubscriptions: false,
      subscriptions: [],
      dateFilter: null,
      countItems: []
    }
  },
  methods:{

    filterDate(date){
      setTimeout(() =>{
        this.dateFilter = date
        this.getSubscriptions()
      }, 200)
    },

    datefilterNull(){
      this.dateFilter = null
    },

    searchSubscriptions(data) {
      this.subscriptions = data
    },

    async getSubscriptions() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-subscriptions-admin/${JSON.stringify(this.dateFilter)}/?state=${this.valueFilterState}&plan=${this.valueFilterPlan}`).then(resp => {
        this.subscriptions = resp.data.data
        this.countItems = resp.data.countDataState

        if (this.subscriptions.length === 0) {
          return this.messageIsSubscriptions = true
        }
        this.messageIsSubscriptions = false
      }).catch(e => {

        console.log(e)
        this.$toast.error("Error al obtener las subscripciones. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },

    filters(data){

      this.valueFilterPlan = data.valuePlan ?? ''
      this.valueFilterState = data.valueState ?? ''

      setTimeout(() => {
        this.getSubscriptions()
      }, 200)
    }

  },

  mounted() {
    this.getSubscriptions()
  }
}
</script>

<style scoped>

</style>
