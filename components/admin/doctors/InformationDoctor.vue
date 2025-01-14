<template>
  <div>
    <div class="row">
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Nombre:</label>
        <p>{{ doctor.fullName }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Cumpleaños:</label>
        <p>{{ this.$moment(doctor.birthday).format('DD MMMM YYYY') }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Correo Electrónico:</label>
        <div>
          <a :href="`mailto:${doctor.email}`">{{ doctor.email }}</a>
        </div>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Teléfono:</label>
        <p>{{ doctor.phone }}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Dirección:</label>
        <p>{{ doctor.address ? doctor.address : 'No registrado'}}</p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">País:</label>
        <p>{{ doctor.country.name }} <span><img width="15" :src="doctor.country.flag" alt=""></span></p>
      </div>
      <div class="col-12 col-lg-6 col-md-6">
        <label class="form-label font-weight-bold" for="first-name-column">Ciudad:</label>
        <p>{{ doctor.city ? doctor.city.name : 'No registrado'}}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <label class="form-label font-weight-bold" for="first-name-column">Información:</label>
        <p class="text-justify">{{ doctor.biography }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InformationDoctor",
  props: ['doctor']
}
</script>

<style scoped>

</style>
