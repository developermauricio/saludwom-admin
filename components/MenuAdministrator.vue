<template>
  <div>
    <BootstrapSidebar
      :initial-show="initialShow"
      :links="links"
      :header="header"
      :fa="false"
      @sidebarChanged="onSidebarChanged"
    >

      <template v-slot:content>
        <b-container style="margin-top: 56px">
          <router-view/>
        </b-container>
      </template>
    </BootstrapSidebar>
  </div>
</template>

<script>
import {bus} from "../plugins/bus";

export default {
  name: "MenuAdministrator",
  data() {
    return {
      initialShow: true,
      header: `<span class="brand-logo m-auto d-flex justify-content-center"><img width="140" class="text-center" src="${require(`~/assets/img/logo_saludwom.png`)}" alt=""></span>`,
      links: [
        {name: "Panel de Control", href: {name: "index.panel.control"}, icon: "bar-chart-2"},
        {name: "Citas", href: {name: "index.appointments"}, icon: "clock"},
        {name: "Pacientes", href: {name: "index.patients"}, icon: "users"},
        {name: "Objetivos", href: {name: "index.objectives"}, icon: "zap"},
        {name: "Suscripciones", href: {name: "index.subscriptions"}, icon: "trello"},
        {name: "Ordenes de Compra", href: {name: "index.orders"}, icon: "dollar-sign"},
        {
          name: "Especialistas",
          icon: "users",
          children: [
            {
              name: "Lista de Esp.",
              href: {
                name: "index.doctors",
              },
              icon: "users",
            },
            {
              name: "Especialidades",
              href: {
                name: "index.specialities",
              },
              icon: "plus",
            },
          ],
        },
        {name: "Planes", href: {name: "index.plans"}, icon: "grid"},
        {name: "Cupones", href: {name: "index.coupons"}, icon: "box"},
        {name: "Recursos", href: {name: "index.resources"}, icon: "paperclip"},
        {name: "Cuestionarios", href: {name: "index.questionnaires"}, icon: "file-text"},
      ],
    }
  },
  methods: {
    onSidebarChanged() {
      console.log()
    },
  }
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
