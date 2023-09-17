<template>
  <div>
    <div class="row" id="table-striped">
      <div class="col-12">
        <TableDoctors
          :doctors.sync="doctors"
          :messageIsDoctors="messageIsDoctors"
          @searchDoctors="searchDoctors"
          @updateTableDoctor="getDoctors"
        />
      </div>
    </div>
  </div>
</template>

<script>

import {bus} from "../../../plugins/bus";

export default {
  name: "ListsDoctors",
  data() {
    return {
      messageIsDoctors: false,
      doctors: [],
      countItems: []
    }
  },
  created() {
    setTimeout(() =>{
      bus.$on('updateTableListDoctor', () => {
        this.getDoctors();
      })
    }, 200)
  },
  methods: {
    searchDoctors(data) {
      this.doctors = data
    },
    async getDoctors() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-doctors-admin`).then(resp => {
        this.doctors = resp.data.data
        this.countItems = resp.data.countDataState
        this.$vs.loading.close()
        if (this.doctors.length === 0) {
          return this.messageIsDoctors = true
        }
        this.messageIsDoctors = false
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Error al obtener los doctores. Consulte a soporte SaludWom");
      })
    },
  },
  mounted() {
    this.getDoctors()
  }
}
</script>

<style scoped>

</style>
