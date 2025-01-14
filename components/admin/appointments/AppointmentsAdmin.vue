<template>
  <div>

    <div class="card">
      <div class="card-header d-flex justify-content-between">

        <h3>Agenda</h3>
        <!-- Lista de doctores  -->
        <div class="mb-1">
          <label class="form-label" for="exampleFormControlTextarea1">Filtrar por especialista</label>
          <multiselect
            v-model="selectedDoctors"
            :options="doctors"
            :searchable="true"
            :close-on-select="true"
            :custom-label="nameSelectDoctors"
            track-by="id"
            :multiple="true"
            selectedLabel="Seleccionado"
            deselectLabel=""
            selectLabel="Selecciona"
            :show-labels="true"
            placeholder="Buscar especialista...">

          </multiselect>
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
      AGENDA
     ======================================-->
        <FullCalendarAdmin :selectedDoctors="selectedDoctors"/>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "@/plugins/bus";

export default {
  name: "AppointmentsAdmin",
  data() {
    return {
      selectedDoctors: [],
      doctors: []
    }
  },
  methods: {
    nameSelectDoctors({fullName}) {
      return `${fullName}`
    },

    async getDoctors() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      await this.$axios.get(`/api/v1/get-doctors-admin`).then(resp => {
        this.doctors = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los especialistas. Consulte a soporte SaludWom");
      }).finally(() => {
        this.$vs.loading.close()
      })
    },
  },
  mounted() {
    this.getDoctors()
  },
  watch: {
    selectedDoctors:{
      handler(val) {
        console.log(val)
        setTimeout(() => {
            bus.$emit('eventSelectedDoctors', val)
        }, 200)
      },
      deep: true
    }
  }
}
</script>


<style scoped>

</style>
