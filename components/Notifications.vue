<template>
  <div>
<!--   Icon Notificaciones -->
    <li class="nav-item dropdown dropdown-notification me-25">
      <a class="nav-link" @click="show=true">
        <div v-html="$feathericons['bell'].toSvg()"></div>
        <span class="badge rounded-pill bg-danger badge-up">{{ this.totalNews }}</span>
      </a>
    </li>
<!--    Contenido Notificaciones-->
    <vs-sidebar position-right parent="body" default-index="1" color="primary" class="sidebarx" spacer v-model="show">
      <div class="">
        <!--    Header Notificación    -->
        <div class="p-2">
          <div>
            <h4>Notificaciones <span class="badge bg-danger text-white">{{ this.totalNews }}</span></h4>
          </div>
        </div>
        <!--    Contenido Notificación    -->
        <div :class="notification.read_at ?'': 'bg-notification'" v-for="notification in notifications"
             :key="notification.id">
          <a style="cursor: pointer" @click="readAtNotification(JSON.parse(notification.data).link, notification)">
            <div class="p-2">
              <p class="m-0 text-dark" v-html="JSON.parse(notification.data).title"></p>
              <p  v-html="JSON.parse(notification.data).description"></p>
              <p class="m-0">{{ formatDate(notification.created_at) }}</p>
            </div>
            <hr class="m-0">
          </a>
        </div>
        <div class="text-center mt-5" v-if="notifications && notifications.length === 0">
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
  data(){
    return{
      show: false,
      notifications: [],
      timezoneUser: null,
      totalNews: 0,
    }
  },
  methods:{
    readAtNotification(link, notification) {
      if(notification.read_at === null){
        this.$axios.post(`api/v1/read-at-notification/${notification.id}`).then(resp => {
          this.notifications.forEach(item =>{
            if (item.id === notification.id){
              item.read_at = 'Leida'
              this.totalNews--
            }
          })
        }).catch(e =>{
          console.log('Error al leer la notificación')
        })
      }
      if (link){
        setTimeout(() => {
          this.$router.push(link)
        }, 200)
      }
      this.show = false
    },
    formatDate(date) {
      let now = this.$moment();
      let publishedDate = this.$moment(date).tz(this.timezoneUser)
      return this.$moment.duration(publishedDate.diff(now)).humanize(true)
    },

    getNotifications() {
      this.$axios.get(`api/v1/get-notification-users/${this.$auth.user.id}`).then(resp => {
        this.notifications = []
        this.totalNews = 0
        resp.data.data.data.map(item => {
          if (item.read_at === null) {
            this.totalNews++
          }
          this.notifications.push(item);
        })
      }).catch(err => {
        console.log('Error al cargar las notificaciones', err)
      })
    },
    async newNotification() {
      await subscriberMQTT('notification-0001', 'notification', (data) => {
        if (parseInt(data) === this.$auth.user.id){
          setTimeout(() => {
            this.getNotifications()
          }, 800)
        }
      })
    },
  },
  created() {
    this.timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone
  },
  mounted() {
    this.getNotifications()
    this.newNotification()
  }
}
</script>

<style scoped>

</style>
