<template>
    <div class="mt-3">
      <h4 class="mb-2">Lista de Objetivos Asignados</h4>
      <div class="row">

        <div class="col-12 col-md-4 col-lg-4">
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="fw-bolder mb-0">{{ doctor.countTotalValuation}}</h2>
                <p class="card-text">Total Objetivos</p>
              </div>
              <div class="avatar bg-light-primary p-50 m-0">
                <div class="avatar-content">
                  <div v-html="$feathericons['zap'].toSvg()"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 col-lg-4">
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="fw-bolder mb-0">{{ doctor.stateInTreatment}}</h2>
                <p class="card-text">En tratamiento</p>
              </div>
              <div class="avatar bg-light-secondary p-50 m-0">
                <div class="avatar-content">
                  <div v-html="$feathericons['zap'].toSvg()"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-4 col-lg-4">
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="fw-bolder mb-0">{{ doctor.stateFinished }}</h2>
                <p class="card-text">Finalizados</p>
              </div>
              <div class="avatar bg-light-success p-50 m-0">
                <div class="avatar-content">
                  <div v-html="$feathericons['zap'].toSvg()"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!--  Tabla con la lista de objetivos asignados a un doctor en especifico  -->
      <TableListObjectivesDoctor :valorations="doctor.valuations"/>
    </div>
</template>

<script>
export default {
  name: "ObjectivesDoctor",
  props: ['doctor']
}
</script>

<style scoped>

</style>
