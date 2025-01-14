<template>
  <div>
    <div class="row" id="table-striped">
      <div class="col-12">

        <!--    Sección tabs    -->
        <div>
          <vs-tabs :value="valueTabPosition" color="#D85C72" alignment="fixed" class="tabs-objective">
            <vs-tab label="Lista de Planes">

              <div class="pt-2">
                <TablePlans
                  :plans.sync="plans"
                  :messageIsPlans="messageIsPlans"
                  @searchPlans="searchPlans"
                  @updateTablePlan="getPlans"
                />
              </div>

            </vs-tab>
            <vs-tab label="Vista Previa">
              <div class="pt-2">
                <PlanPreview/>
              </div>
            </vs-tab>
          </vs-tabs>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "ListPlans",
  data() {
    return {
      valueTabPosition: 0,
      messageIsPlans: false,
      plans: [],
      countItems: []
    }
  },
  created() {
    setTimeout(() => {
      bus.$on('updateTableListPlans', () => {
        this.getPlans();
      })
    }, 200)
  },
  methods: {
    searchPlans(data) {
      this.plans = data
    },
    async getPlans() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-plans`).then(resp => {
        this.plans = resp.data.data
        this.countItems = resp.data.countDataState

        if (this.plans.length === 0) {
          return this.messageIsPlans = true
        }
        this.messageIsPlans = false
      }).catch(e => {

        console.log(e)
        this.$toast.error("Error al obtener los planes. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })

    }
  },
  mounted() {
    this.getPlans()
  }
}
</script>


<style scoped>

</style>
