<template>
  <nav
    class="header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-light navbar-shadow container-xxl">
    <div class="navbar-container d-flex content">

      <div class="bookmark-wrapper d-flex align-items-center">
        <ul class="nav navbar-nav d-xl-none">
          <li class="nav-item">
            <a class="nav-link menu-toggle" href="#">
              <div class="mr-1" v-html="$feathericons['menu'].toSvg()"></div>
            </a>
          </li>
        </ul>
      </div>

      <ul class="nav navbar-nav align-items-center ms-auto">

        <!--=====================================
             NOTIFICACIONES
           ======================================-->
        <Notifications class="mr-3"/>

        <!--=====================================
           INFORMACIÓN DEL USUARIO
         ======================================-->
        <li class="nav-item dropdown dropdown-user">
          <a class="nav-link dropdown-toggle dropdown-user-link" id="dropdown-user" href="#" data-bs-toggle="dropdown"
             aria-haspopup="true" aria-expanded="false">
            <div class="user-nav d-sm-flex d-none">
              <span class="user-name fw-bolder">{{ $auth.user.name }} {{ $auth.user.last_name }}</span>
              <span class="user-status">{{ $auth.user.roles[0].name }}</span>
            </div>
            <span class="avatar">
          <img class="round"
               :src="userPicture"
               alt="avatar" height="40"
               width="40">
          <span class="avatar-status-online"></span>
          </span>
          </a>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown-user">
            <a class="dropdown-item d-flex align-items-center" href="page-profile.html">
              <div class="mr-1" v-html="$feathericons['user'].toSvg()"></div>
              Perfil
            </a>
            <div class="dropdown-divider"></div>
            <div @click.prevent="logout">
              <a class="dropdown-item d-flex align-items-center" href="#">
                <div class="mr-1" v-html="$feathericons['power'].toSvg()"></div>
                Cerrar Sesión
              </a>
            </div>

          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {bus} from "../plugins/bus";

export default {
  name: "Header",
  data() {
    return {
      themeDark: false,
    }
  },
  computed: {
    userPicture() {
      if (this.$auth.user.picture.includes('user-profile.png') || this.$auth.user.picture.includes('storage')){
        return `${this.$config.urlBack}${this.$auth.user.picture}`
      }
      // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
      return this.$auth.user.picture
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push({name: 'login'});
    },
    changeTheme(theme) {
      location.reload()
      switch (theme) {
        case 'dark-layout':
          localStorage.removeItem('theme')
          localStorage.setItem('theme', theme)
          this.themeDark = true
          bus.$emit('themeDark', true)
          break
        case 'semi-dark':
          localStorage.removeItem('theme')
          localStorage.setItem('theme', theme)
          this.themeDark = false
          bus.$emit('themeDark', false)
          break
      }
    }
  },
  mounted() {
    let theme = localStorage.getItem('theme')
    if (theme === 'dark-layout') {
      this.themeDark = true
    } else {
      this.themeDark = false
    }
  }
}
</script>

<style scoped>

</style>
