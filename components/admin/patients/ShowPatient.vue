<template>
  <div class="p-5">
    <div>
      <div class="d-flex justify-content-between">
        <div class="d-flex align-items-center mb-2">
        <span class="avatar mr-2">
          <img class="round"
               :src="userPicture"
               alt="avatar" height="70"
               width="70">
        </span>
          <div>
            <h3 class="m-0">Pac. {{ patient.name }}</h3>
            <div>
              <a :href="`mailto:${patient.email}`">{{ patient.email }}</a>
            </div>
          </div>
        </div>
        <div>
          <span :class="`badge bg-${patient.state == '1' ? 'success' : 'danger'} cursor-pointer`" @click="changeStatus">{{ patient.state == '1' ? 'Activo' : 'Inactivo' }}</span>
        </div>
      </div>
      <div>

      </div>
    </div>
    <!--  Información -->
    <div>
      <vs-tabs color="#622240">
        <vs-tab label="Objetivos">
          <div class="con-tab-ejemplo">
            <!--   Objetivos del paciente     -->
            <ObjectivesPatient :patient="patient"/>
          </div>
        </vs-tab>
        <vs-tab label="Suscripciones">
          <div class="con-tab-ejemplo">
            <!--   Suscripciones del paciente     -->
            <SubscriptionsPatient :patient="patient"/>
          </div>
        </vs-tab>
        <vs-tab label="Información">
          <div class="con-tab-ejemplo">
            <!--   Información del doctor     -->
            <InformationPatient :patient="patient"/>
          </div>
        </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowPatient",
  props: ['patient'],
  computed: {
    userPicture() {
      if (this.patient.picture){
        if (this.patient.picture.includes('user-profile.png') || this.patient.picture.includes('storage')) {
          return `${this.$config.urlBack}${this.patient.picture}`
        }
        // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
        return this.patient.picture
      }
    }
  },
  methods: {
    changeStatus() {

      this.$swal.fire(
        {
          title: `Esta seguro ${this.patient.state == '1' ? '<strong>Inactivar</strong>. Verifique que este paciente no tenga citas pendientes' : '<strong>Activar</strong>'} `,
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'No',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary mr-2'
          },

          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          this.$axios.post(`/api/v1/change-status-patient/${this.patient.user_id}`).then(resp => {
            this.patient.state = resp.data.user.state
            this.$toast.success('El estado se actualizó correctamente.')
          }).catch(e => {
            console.log(e)
            this.$toast.error('Error al actualizar el estado. Consulte con soporte SaludWom.')
          }).finally(() =>{
            this.$vs.loading.close()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
