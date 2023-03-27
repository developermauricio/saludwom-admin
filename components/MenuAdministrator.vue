<template>
  <div>
    <div class="main-menu menu-fixed menu-light menu-accordion menu-shadow" data-scroll-to-active="true">
      <div class="navbar-header">
        <ul class="nav navbar-nav text-center">
          <li class="nav-item">
            <a @click="goTo('/panel-control')" class="navbar-brand">
              <span class="brand-logo m-auto">
                <img width="140" class="text-center" :src="require(`~/assets/img/logo_saludwom.png`)" alt="">
              </span>
            </a>
          </li>
          <li class="nav-item nav-toggle">
            <!--            <a class="nav-link modern-nav-toggle pe-0" data-bs-toggle="collapse">-->

            <!--              <i class="d-block d-xl-none text-primary toggle-icon font-medium-4" v-html="$feathericons['x'].toSvg()"-->
            <!--                 data-feather="x"></i>-->
            <!--              <i class="d-none d-xl-block collapse-toggle-icon font-medium-4  text-primary"-->
            <!--                 v-html="$feathericons['disc'].toSvg()"></i>-->
            <!--            </a>-->
          </li>
        </ul>
      </div>
      <div class="shadow-bottom"></div>
      <div class="main-menu-content mt-4">
        <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
          <li :class="this.currentUrl === '/panel-control' ? 'active' :''" class=" nav-item">
            <a @click="goTo('/panel-control')" class="d-flex align-items-center menu-principal">
              <div v-html="$feathericons['home'].toSvg()"></div>
              <div class="content-title-text ">
                <span class="menu-title text-truncate">Panel de Control</span>
                <!--                <span class="badge badge-light-warning rounded-pill ms-auto me-1">2</span>-->
              </div>
            </a>
          </li>
          <li class=" navigation-header">
            <span data-i18n="Apps &amp; Pages">Menú Principal</span>
            <!--            <div v-html="$feathericons['more-horizontal'].toSvg()"></div>-->
          </li>
          <li :class="this.currentUrl === '/pacientes' ? 'active' :''" class=" nav-item">
            <a @click="goTo('/pacientes')" class="d-flex align-items-center menu-principal">
              <div v-html="$feathericons['users'].toSvg()"></div>
              <div class="content-title-text">
                <span class="menu-title text-truncate">Pacientes</span>
              </div>
            </a>
          </li>
          <li :class="this.currentUrl === '/cuestionarios' ? 'active' :''" class=" nav-item">
            <a @click="goTo('/cuestionarios')" class="d-flex align-items-center menu-principal">
              <div v-html="$feathericons['users'].toSvg()"></div>
              <div class="content-title-text">
                <span class="menu-title text-truncate">Cuestionarios</span>
              </div>
            </a>
          </li>

<!--          <li :class="this.currentUrl === '/instructores' ? 'active' :''" class=" nav-item">-->
<!--            <a @click="goTo('/instructores')" class="d-flex align-items-center menu-principal">-->
<!--              <div v-html="$feathericons['users'].toSvg()"></div>-->
<!--              <div class="content-title-text">-->
<!--                <span class="menu-title text-truncate">Instructores</span>-->
<!--              </div>-->
<!--            </a>-->
<!--          </li>-->

<!--          <li :class="this.currentUrl === '/vehiculos' ? 'active' :''" class="nav-item" style="margin-top: 5px">-->
<!--            <a @click="goTo('/vehiculos')" class="d-flex align-items-center menu-principal">-->
<!--              <img style="width: 2rem"-->
<!--                   :src="require(`~/app-assets/images/icons/${currentTheme === 'dark-layout' ? (this.currentUrl === '/vehiculos' ? 'icon-car-menu-active.png' : 'icon-car-white.png')  : this.currentUrl === '/vehiculos' ? 'icon-car-menu-active.png' : 'icon-car-black.png'}`)"-->
<!--                   alt="">-->
<!--              <div class="content-title-text icon-car">-->
<!--                <span class="menu-title text-truncate">Vehículos</span>-->
<!--              </div>-->
<!--            </a>-->
<!--          </li>-->

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "../plugins/bus";

export default {
  name: "MenuAdministrator",
  data() {
    return {
      currentTheme: '',
      currentUrl: '',
    }
  },
  methods: {
    goTo(link) {
      this.currentUrl = link
      this.$router.push({path: link})
    }
  },
  mounted() {}
}
</script>

<style scoped>
.main-menu.menu-light .menu-principal.router-link-exact-active {
  background: linear-gradient(118deg, #16B4BC, rgba(22, 180, 188, 0.76)) !important;
  box-shadow: 0 0 10px 1px rgba(22, 180, 188, 0.49) !important;
  color: #fff !important;
  font-weight: 400 !important;
  border-radius: 4px !important;
}
</style>
