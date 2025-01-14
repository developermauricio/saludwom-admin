import Vue from 'vue';

Vue.prototype.$customScriptVendor = () => {
  const script = document.createElement('script');
  script.src = '/app-assets/vendors/js/vendors.min.js'; // Ruta absoluta
  script.async = true;
  document.head.appendChild(script);
};
Vue.prototype.$customScriptMenu = () => {
  const script = document.createElement('script');
  script.src = './app-assets/js/core/app-menu.js';
  script.async = true;
  document.head.appendChild(script);
};
Vue.prototype.$customScriptApp = () => {
  const script = document.createElement('script');
  script.src = './app-assets/js/core/app.js';
  script.async = true;
  document.head.appendChild(script);
};
