<template>
  <div>
    <CardInfoStateOrders :countDataStateOrders.sync="countItems"/>

    <div class="row" id="table-striped">
      <div class="col-12">
          <TableOrders
            @filters="filters"
            @filterDate="filterDate"

            @datefilterNull="datefilterNull"
            @searchOrders="searchOrders"
            @updateGetOrders="getOrders"
            :orders.async="orders"
            :messageIsOrders="messageIsOrders"
          />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListOrders",
  data() {
    return {
      countItems: [],
      valueFilterPlan: '',
      valueFilterState: '',
      valueTabPosition: 0,
      messageIsOrders: false,
      orders: [],
      dateFilter: null,
    }
  },
  methods:{

    filterDate(date){
      setTimeout(() =>{
        this.dateFilter = date
        this.getOrders()
      }, 200)
    },

    datefilterNull(){
      this.dateFilter = null
    },

    searchOrders(data) {
      this.orders = data
    },

    async getOrders() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-orders-admin/${JSON.stringify(this.dateFilter)}/?state=${this.valueFilterState}&plan=${this.valueFilterPlan}`).then(resp => {
        console.log(resp.data)
        this.orders = resp.data.data
        this.countItems = resp.data.countDataState

        if (this.orders.length === 0) {
          return this.messageIsSubscriptions = true
        }
        this.messageIsOrders = false

      }).catch(e => {

        console.log(e)
        this.$toast.error("Error al obtener las ordenes de compra. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },

    filters(data){

      this.valueFilterPlan = data.valuePlan ?? ''
      this.valueFilterState = data.valueState ?? ''

      setTimeout(() => {
        this.getOrders()
      }, 200)
    }
  },
  mounted() {
    this.getOrders()
  }
}
</script>

<style scoped>

</style>
