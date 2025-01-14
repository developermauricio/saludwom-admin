<template>
  <div class="p-5">
    <!--   Nombre y Biografia     -->
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
            <h3 class="m-0">Esp. {{ doctor.fullName }}</h3>
            <div>
              <a :href="`mailto:${doctor.email}`">{{ doctor.email }}</a>
            </div>
          </div>
        </div>
        <div>
          <span :class="`badge bg-${doctor.state == '1' ? 'success' : 'danger'} cursor-pointer`"
                @click="changeStatus">{{ doctor.state == '1' ? 'Activo' : 'Inactivo' }}</span>
        </div>
      </div>
      <div>

        <ul class="list-unstyled">
          <li v-for="treatment in doctor.treatments" :key="treatment.id" class="fz-14 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {{ treatment.treatment }}.
          </li>
        </ul>

      </div>
    </div>
    <!--  Información -->
    <div>
      <vs-tabs color="#622240">
        <vs-tab label="Objetivos Asignados">
          <div class="con-tab-ejemplo">
            <!--   Objetivos del doctor     -->
            <div>
              <ObjectivesDoctor :doctor="doctor"/>
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Agenda">
          <div class="con-tab-ejemplo">
            <!--   Información del doctor     -->
            <FullCalendarDoctor :doctor="doctor"/>
          </div>
        </vs-tab>
        <vs-tab label="Información">
          <div class="con-tab-ejemplo">
            <!--   Información del doctor     -->
            <InformationDoctor :doctor="doctor"/>
          </div>
        </vs-tab>
      </vs-tabs>
    </div>

  </div>
</template>

<script>
export default {
  name: "ShowDoctor",
  props: ['doctor'],
  computed: {
    userPicture() {

      if (this.doctor.picture.includes('user-profile.png') || this.doctor.picture.includes('storage')){
        return `${this.$config.urlBack}${this.doctor.picture}`
      }
      // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
      return this.doctor.picture
    }
  },
  methods: {
    changeStatus() {
      this.$swal.fire(
        {
          title: `Esta seguro ${this.doctor.state == '1' ? '<strong>Inactivar</strong>. Verifique que este especialista no tenga citas pendientes' : '<strong>Activar</strong>'} `,
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
          this.$axios.post(`/api/v1/change-status-doctor/${this.doctor.userId}`).then(resp => {
            this.doctor.state = resp.data.user.state
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
