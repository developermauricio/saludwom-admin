export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'saludwom-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    bodyAttrs: {
      class: 'vertical-layout vertical-menu-modern  navbar-floating',
      'data-open': "click",
      'data-menu':"vertical-menu-modern",
      'data-col':""
    },
    script: [
      { src: "https://code.jquery.com/jquery-3.4.1.min.js" },
      // {
      //   src: 'https://unpkg.com/feather-icons'
      // },
      // {
      //   src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/1.5.5/perfect-scrollbar.min.js'
      // },
      {
        type:'text/javascript'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/application.scss',
    '@/app-assets/vendors/css/vendors.min.css',
    '@/app-assets/css/plugins/extensions/ext-component-sweet-alerts.css',
    '@/app-assets/css/plugins/extensions/ext-component-toastr.css',
    '@/app-assets/css/bootstrap.css',
    '@/app-assets/css/bootstrap-extended.css',
    '@/app-assets/css/core/menu/menu-types/vertical-menu.css',
    '@/app-assets/css/colors.css',
    '@/app-assets/css/components.css',
    '@/app-assets/css/themes/dark-layout.css',
    '@/app-assets/css/themes/bordered-layout.css',
    '@/app-assets/css/themes/semi-dark-layout.css',
    '@/app-assets/css/core/menu/menu-types/vertical-menu.css',
    '@/app-assets/css/pages/authentication.css',
    '@/app-assets/css/pages/app-chat.css',
    '@/app-assets/css/pages/app-chat-list.css',
    '@/assets/css/style.css',
    'boxicons/css/boxicons.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-sax',
    '~/plugins/vuelidate',
    '~/plugins/laravel-permissions',
    { src: '~/plugins/vue-easytable', ssr: false},
    { src: '~/plugins/splideplugin' , mode: 'client' },
    {src: '~/plugins/mqtt', mode: 'client', ssr: false},
    { src: '~/app-assets/js/core/app.js', mode: 'client'},
    { src: '~/plugins/vue-ctk-date-time-picker', ssr: false},
    { src: '~/app-assets/js/core/app-menu.js', mode: 'client'},
    { src: '~/app-assets/vendors/js/vendors.min.js', mode: 'client'},
    { src: '~/plugins/vue-toastification', mode: 'client', ssr: false},
  ],

  publicRuntimeConfig: {
    urlBack: process.env.BASE_URL_API_BACK,
    nameApp: process.env.NAME,
    colorLoading: process.env.COLOR_BASE,
    axios: {
      // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
      baseURL: process.env.BASE_URL_API_BACK,
    }
  },

  auth: {
    redirect: {
      home: '/panel-control',
      logout: '/login'
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user'
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/api/v1/user', method: 'get' }
        }
      }
    }
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    global: true,
    dirs: [
      '~/components',
      '~/components/valoration',
      '~/components/doctor/patients',
      '~/components/doctor/valorations',
      '~/components/admin/patients'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/router',
    '@nuxtclub/feathericons'
  ],
  moment: {
    defaultLocale: 'es',
    locales: ['es'],
    timezone: true,
    defaultTimezone: 'Europe/Madrid'
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
