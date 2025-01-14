<template>
  <div>
    <!--   Icon Notificaciones -->
    <li class="nav-item dropdown dropdown-notification me-25">
      <a class="nav-link" @click="show=true">
        <div v-html="$feathericons['bell'].toSvg()"></div>
        <span v-if="this.totalNews > 0" class="badge rounded-pill bg-danger badge-up">{{ this.totalNews }}</span>
      </a>
    </li>
    <!--    Contenido Notificaciones-->
    <vs-sidebar position-right parent="body" default-index="1" color="primary" class="sidebarx" spacer v-model="show">
      <div class="">
        <!--    Header Notificación    -->
        <div class="p-2">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4>Notificaciones</h4>
              <a class="position-relative text-primary" style="font-size: 0.9rem; cursor: pointer; z-index: 100"
                 @click="markNotificationsAsRead">Marcar todas como leídas</a>
            </div>
            <div class="">
              <div>
                <span class="ms-1 badge bg-danger text-white mr-2" style="margin-bottom: 5px">{{ this.totalNews }} sin leer</span>
              </div>
              <div>
                <span class="ms-1 badge bg-primary text-white">{{ this.totalNotif }} todas</span>
              </div>
            </div>
          </div>
        </div>
        <hr class="m-0">
        <!--    Contenido Notificación    -->
        <vue-loadmore
          :loadOffset="80"
          :finishedText="'No hay más notificaciones'"
          :loadingText="'Cargando'"
          :successText="'Actualizado'"
          :loosingText="'Soltar para actualizar'"
          :refreshText="'Actualizando'"
          :pullingText="'Desplegar para actualizar'"
          ref="loadmoreRef"
          :finished="finished"
          :on-refresh="onRefresh"
          :on-loadmore="onLoad">
          <div :class="notification.read_at ?'': 'bg-notification'" v-for="(notification, index) in notifications"
               :key="notification.id+'-'+index">
            <a style="cursor: pointer" @click="readAtNotification(JSON.parse(notification.data).link, notification)">
              <div class="p-2">
                <p class="m-0 text-dark" v-html="JSON.parse(notification.data).title"></p>
                <p v-html="JSON.parse(notification.data).description"></p>
                <p class="m-0">{{ formatDate(notification.created_at) }}</p>
              </div>
              <hr class="m-0">
            </a>
          </div>
        </vue-loadmore>
        <div class="text-center mt-5" v-if="notNotifications && notifications.length === 0">
          <p class="" style="font-size: 1.2rem !important;">Sin notificaciones</p>
        </div>
      </div>
    </vs-sidebar>
  </div>
</template>

<script>
import {subscriberMQTT} from "../plugins/mqtt";

export default {
  name: "Notifications",
  data() {
    return {
      show: false,
      notifications: [],
      timezoneUser: null,
      totalNews: 0,
      totalNotif: 0,
      finished: false,
      page: 1,
      pageSize: 0,
      notNotifications: false
    }
  },
  computed: {
    url() {
      return `/api/v1/get-notification-users/${this.$auth.user.id}/?page=${this.page}`;
    }
  },
  methods: {
    markNotificationsAsRead() {
      if (this.totalNews === 0) {
        return
      }
      this.$vs.loading({
        color: process.env.COLOR_BASE,
        text: 'Espere por favor...'
      })
      this.$axios.post(`api/v1/mark-notifications-as-read`).then(resp => {
        this.notifications = []
        this.getNotifications()
        this.$vs.loading.close()
      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
      })
    },
    initData() {
      this.notifications = []
      this.finished = false
      this.page = 1
    },
    onRefresh(done) {
      setTimeout(() => {
        this.initData()
        this.getNotifications()
        done();
      }, 50)

    },
    onLoad(done) {
      if (this.page <= this.pageSize) {
        this.page++;
        this.getNotifications()
      } else {
        this.finished = true
      }
      done();
    },
    readAtNotification(link, notification) {
      if (notification.read_at === null) {
        this.$axios.post(`api/v1/read-at-notification/${notification.id}`).then(resp => {
          this.notifications.forEach(item => {
            if (item.id === notification.id) {
              item.read_at = 'Leida'
              this.totalNews--
            }
          })
        }).catch(e => {
          console.log('Error al leer la notificación')
        })
      }
      if (link) {
        setTimeout(() => {
          this.$router.push(link)
        }, 200)
      }
      this.show = false
    },
    formatDate(date) {
      let now = this.$moment();
      console.log(this.timezoneUser)
      let publishedDate = this.$moment(date).tz(this.timezoneUser);
      let diffDuration = this.$moment.duration(publishedDate.diff(now));
      return diffDuration.humanize(true);
    },

    getNotifications() {
      this.$axios.get(this.url).then(resp => {
        this.totalNews = resp.data.not_read_at
        this.totalNotif = resp.data.total
        resp.data.data.data.map(item => {
          this.notifications.push(item);
        })
        if (this.notifications.length === 0) {
          this.$vs.loading.close()
          return this.notNotifications = true
        }
        this.pageSize = resp.data.lastPage
      }).catch(err => {
        console.log('Error al cargar las notificaciones', err)
      })
    },
    async newNotification() {
      await subscriberMQTT('notification-0001', 'notification', (data) => {
        console.log(data)
        if (parseInt(data) === this.$auth.user.id) {
          setTimeout(() => {
            this.notifications = []
            this.getNotifications()
          }, 800)
        }
      })
    },
  },
  created() {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (userTimeZone) {
        this.timezoneUser = userTimeZone;
      } else {
        // Si no se pudo obtener la zona horaria del navegador, establecer una predeterminada
        this.timezoneUser = 'Europe/Madrid'; // Por ejemplo, configurar como UTC
      }
    } catch (error) {
      console.error('Error al obtener la zona horaria:', error);
      // En caso de un error, también puedes establecer una zona horaria predeterminada
      this.timezoneUser = 'Europe/Madrid';
    }
  },
  mounted() {
    this.getNotifications()
    this.newNotification()
  }
}
</script>

<style scoped>

</style>
