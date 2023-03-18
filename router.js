import Vue from "vue";
import Router from 'vue-router';

Vue.use(Router);

const page = path => () => import(`~/pages/${path}`).then(m => m.default || m);

const routes = [

  /*=============================================
     RUTAS APP
   =============================================*/
  {
    path: '/',
    name: 'app',
    component: page('index.vue'),
    children: [
      /* Rutas para el panel de control*/
      {path: '/panel-control', name: 'index.panel.control', component: page('app/panel-control/Index.vue')},
      /* Rutas para los pacientes*/
      {path: '/pacientes', name: 'index.patients', component: page('app/patients/Patients.vue')},
      /* Rutas para los objetivos o valoraciones*/
      {path: '/objetivos', name: 'index.objectives', component: page('app/valorations/Valorations.vue')},
      {path: '/objetivos/:slug', name: 'show.objectives', component: page('app/valorations/ShowValoration.vue')},
    ]
  },

  /*=============================================
     RUTAS AUTH
   =============================================*/
  {path: '/login', name: 'login', component: page('auth/login/Login.vue')},
  {path: '/password/email', name: 'password.email', component: page('auth/password/ResetEmail.vue')},
  {path: '/password-reset/:token', name: 'password.reset', component: page('auth/password/PasswordReset.vue')},
];

export function createRouter() {
  return new Router({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
  })
}
