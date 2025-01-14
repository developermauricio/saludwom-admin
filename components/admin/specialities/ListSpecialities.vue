<template>
  <div>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TableSpecialities
          :specialities="specialities"
          :messageIsSpecialities="messageIsSpecialities"
          @searchSpecialities="searchSpecialities"
          @updateTableSpecialities="getSpecialities"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "ListSpecialities",
  data() {
    return {
      messageIsSpecialities: false,
      specialities: []
    }
  },
  created() {
    setTimeout(() =>{
      bus.$on('updateTableListSpecilities', () => {
        this.getSpecialities();
      })
    }, 200)
  },
  methods: {
    searchSpecialities(data) {
      this.specialities = data
    },
    getSpecialities() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      this.$axios.get(`/api/v1/get-treatments`).then(resp => {

        this.specialities = resp.data.data
        this.$vs.loading.close()

        if (this.specialities.length === 0) {
          return this.messageIsSpecialities = true
        }
        this.messageIsSpecialities = false
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Error al obtener las especialidades. Consulte a soporte SaludWom");
      })
    }
  },
  mounted() {
    this.getSpecialities()
  }
}
</script>

<style scoped>

</style>
