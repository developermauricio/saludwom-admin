<template>
  <div class="p-3">
    <h2 class="mb-2">Asignar Recurso</h2>
    <div class="row">
      <!--  Nombre del objetivo  -->
      <div class="col-12 col-md-4 col-lg-4">
        <div class="form-group">
          <label class="font-weight-bold">Nombre del Objetivo:</label>
          <p> {{ valoration.name }}</p>
        </div>
      </div>
      <!--  Nombre del Paciente  -->
      <div class="col-12 col-md-4 col-lg-4">
        <div class="form-group">
          <label class="font-weight-bold">Nombre del Paciente:</label>
          <div class="d-flex">
            <p> {{ valoration.patient.user.name }} {{ valoration.patient.user.last_name }}</p>
            <vs-tooltip v-if="valoration.patient.user.country" :text="valoration.patient.user.country.name "
                        position="left" style="cursor:pointer">
              <img class="ml-1" width="20" :src=valoration.patient.user.country_flag alt=""/>
            </vs-tooltip>
          </div>
        </div>
      </div>
      <!--  Identificación  -->
      <div class="col-12 col-md-4 col-lg-4">
        <div class="form-group">
          <label class="font-weight-bold">Identificación:</label>
          <p> {{ valoration.patient.user.document }}</p>
        </div>
      </div>
      <!--  Tratamiento  -->
      <div class="col-12 col-md-4 col-lg-4">
        <div class="form-group">
          <label class="font-weight-bold">Tipo de Tratamiento:</label>
          <span class="badge bg-light-primary"> {{ valoration.treatment.treatment }}</span>
        </div>
      </div>
      <!--  Tratamiento  -->
      <div class="col-12 col-md-4 col-lg-4">
        <div class="form-group">
          <label class="font-weight-bold">Plan:</label>
          <p>{{ valoration.subscription.plan.name }}</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- Tabs Asignar Recursos & Vista Previa  -->
        <vs-tabs alignment="center" color="#792141">
          <vs-tab label="Recursos">
            <div>
              <ListResources/>
            </div>
          </vs-tab>
          <vs-tab label="Vista Previa">
            <div>
              <PreviewResource/>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-secondary mx-1" @click="closeModal">Cancelar</button>
        <button class="btn btn-primary" @click="addResource">Agregar Recurso</button>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "../../../plugins/bus";

export default {
  name: "ModalAddResources",
  props: ['valoration'],
  async beforeMount() {
    await this.$store.dispatch('assignValoration', this.valoration.id)
    await this.$store.dispatch('assignDoctorId', this.valoration.doctor_id)
    await this.$store.dispatch('assignPatientId', this.valoration.patient.user_id)
  },
  methods: {
    async addResource() {
      this.$swal.fire(
        {
          title: '¿Estas seguro de agregar el recurso?',
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'Cancelar',
          customClass: {
            confirmButton: 'btn btn-primary mx-1',
            cancelButton: 'btn btn-secondary'
          },
          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }
      ).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          await this.$store.dispatch('addResource')
          bus.$emit('tabResources', 1)
          this.$vs.loading.close()
        }
      })
    },
    async closeModal() {
      await this.$store.dispatch('clearData')
      this.$FModal.hide()
    },
  }
}
</script>

<style scoped>

</style>
