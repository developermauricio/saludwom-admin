<template>
  <div>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TableCoupons
          :coupons="coupons"
          :messageIsCoupons="messageIsCoupons"
          @searchCoupons="searchCoupons"
          @updateTableCoupons="getCoupons"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "ListCoupons",
  data() {
    return {
      messageIsCoupons: false,
      coupons: []
    }
  },
  created() {
    setTimeout(() =>{
      bus.$on('updateTableCoupons', () => {
        this.getCoupons();
      })
    }, 200)
  },
  methods: {
    searchCoupons() {

    },
    getCoupons(){
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })

      this.$axios.get(`/api/v1/get-coupons`).then(resp => {

        this.coupons = resp.data.data
        this.$vs.loading.close()

        if (this.coupons.length === 0) {
          return this.messageIsCoupons = true
        }
        this.messageIsCoupons = false
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Error al obtener cupones. Consulte a soporte SaludWom");
      })
    }
  },
  mounted() {
    this.getCoupons()
  }
}
</script>

<style scoped>

</style>
