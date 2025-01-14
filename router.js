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
      /* Rutas para los doctores*/
      {path: '/especialistas', name: 'index.doctors', component: page('app/doctors/Doctors.vue')},
      /* Rutas para las especialidades*/
      {path: '/especialidades', name: 'index.specialities', component: page('app/specialities/Specialities.vue')},
      /* Rutas para las citas*/
      {path: '/citas', name: 'index.appointments', component: page('app/appointments/Appointments.vue')},
      /* Rutas para los planes*/
      {path: '/planes', name: 'index.plans', component: page('app/plans/Plans.vue')},
      /* Rutas para los planes*/
      {path: '/cupones', name: 'index.coupons', component: page('app/coupons/Coupons.vue')},
      /* Rutas para las ordenes de compra*/
      {path: '/ordenes', name: 'index.orders', component: page('app/orders/Orders.vue')},
      /* Rutas para los */
      {path: '/suscripciones', name: 'index.subscriptions', component: page('app/subscriptions/Subscriptions.vue')},
      /* Rutas para los cuestionarios*/
      {path: '/cuestionarios', name: 'index.questionnaires', component: page('app/questionnaires/Questionnaires')},
      /* Rutas para los recursos*/
      {path: '/recursos', name: 'index.resources', component: page('app/resources/Resources')},
      {path: '/recursos/:slug/:id', name: 'show.resources', component: page('app/resources/ShowResources')},
    ]
  },

  /*=============================================
     RUTAS AUTH
   =============================================*/
  {path: '/login', name: 'login', component: page('auth/login/Login.vue')},
  {path: '/password/email', name: 'password.email', component: page('auth/password/ResetEmail.vue')},
  {path: '/password-reset/:token', props: true, name: 'password.reset', component: page('auth/password/PasswordReset.vue')},
];

export function createRouter() {
  return new Router({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
  })
}
