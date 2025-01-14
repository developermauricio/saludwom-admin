<template>
  <div>
    <!-- Boton Flotante -->
    <div>
      <a href="#" class="float" @click="funcOpenChat">
        <div class="icon-btn-floating" v-html="$feathericons['message-square'].toSvg()"></div>
      </a>
      <div class="tooltip-chat-button">
        <div class="text-center p-1" style="font-size: 0.85rem">
          Seguimiento Online
          <span v-if="unreadMessages > 0" class="badge rounded-pill bg-danger text-white"
                style="font-size: 13px; height: 21px;right: -8px;top: -8px;">{{ unreadMessages }}</span>
        </div>
      </div>
    </div>
    <!--  Sidebar Contenido Chat  -->
    <vs-sidebar position-right parent="body" default-index="1" color="primary" class="sidebarx sidebar-chat-valuation"
                spacer v-model="openChat">

      <div class="content-chat">

        <section class="chat-app-window">

          <!-- Active Chat -->
          <div class="active-chat">
            <!-- Chat Header -->
            <div class="chat-navbar">
              <header class="chat-header m-0">
                <div class="d-flex align-items-center pt-1">
                  <a @click="openChat=false" class="mr-3">
                    <div class="icon-close-chat" v-html="$feathericons['arrow-left'].toSvg()"></div>
                  </a>
                  <div class="avatar avatar-border user-profile-toggle m-0 me-1">
                    <img v-if="valuation.patient.user.picture"
                         :src="`${$config.urlBack}${valuation.patient.user.picture}`" alt="SaludWom" height="36"
                         width="36"/>
                    <img v-else src="@/assets/img/user-profile.png" alt="SaludWom" height="36" width="36"/>
<!--                    <span class="avatar-status-busy"></span>-->
                  </div>
                  <div class="m-0">
                    <div class="d-flex align-items-center">
                      <h5 class="font-weight-bold m-0">{{ valuation.patient.user.name }} {{
                          valuation.patient.user.last_name
                        }}
                      </h5>
                      <vs-tooltip v-if="valuation.patient.user.country" :text="valuation.patient.user.country.name "
                                  position="button" style="cursor:pointer">
                        <img class="mx-1" width="20" :src=valuation.patient.user.country_flag alt=""/>
                      </vs-tooltip>
                    </div>
                    <div class="m-0">
                      <p class="m-0">{{ valuation.name }}</p>
                    </div>
                  </div>
                </div>

              </header>
            </div>
            <!--/ Chat Header -->

            <!-- User Chat messages -->
            <div class="user-chats py-5" v-if="messages && messages.length > 0">
              <div class="chats py-2">
                <div v-if="finished" class="text-center p-1">
                  <Transition name="modal">
                    <p class="text-primary">No hay más mensajes</p>
                  </Transition>
                </div>
                <div :class="`chat ${$auth.user.id !== message.send_user_id ? 'chat-left':''}`" v-for="(message, index) in messages" :key="index">
                  <div class="chat-body">
                    <div class="chat-content">
                      <p>{{ message.message }}</p>
                      <!-- Time and Status -->
                      <div class="message-time-status">
                        <div class="sent-time">{{ formatDate(message.date) }}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div v-else class="not-messages text-center">
              <!-- To load Conversation -->
              <div class="start-chat-area">
                <div class="mb-1 start-chat-icon">
<!--                  <i data-feather="message-square"></i>-->
                  <i v-html="$feathericons['message-square'].toSvg()"></i>
                </div>
                <h4 class="sidebar-toggle start-chat-text">Inicia la conversación</h4>
              </div>
              <!--/ To load Conversation -->
            </div>
            <!-- User Chat messages -->

            <!-- Submit Chat form -->
          </div>
          <!--/ Active Chat -->
        </section>


      </div>

      <div class="footer-sidebar" slot="footer">
        <div class="content-chat">
          <div class="chat-app-window">
            <div class="chat-app-form">
              <div class="input-group input-group-merge me-1 form-send-message">
                <input type="text" v-model.trim="message" class="form-control message" @keyup.enter="sendMessage" placeholder="Escribe tu mensaje..."/>
              </div>
              <button type="button" class="btn btn-primary send" @click="sendMessage">
                <i v-html="$feathericons['send'].toSvg()"></i>
<!--                <span class="d d-lg-block">Enviar</span>-->
              </button>
            </div>
          </div>
        </div>
      </div>
    </vs-sidebar>
  </div>

</template>

<script>
import {publishMQTT, subscriberMQTT} from "../../plugins/mqtt";

export default {
  name: "ChatValoration",
  data() {
    return {
      message: '',
      openChat: false,
      timezoneUser: null,
      messages: [],
      unreadMessages: 0,
      page: 1,
      pageSize: 0,
      finished: false,
    }
  },
  computed: {
    url() {
      return `api/v1/get-messages-valoration/${this.valuation.chat.id}/?page=${this.page}`
    }
  },
  props: ['valuation', 'chatChannel'],
  methods: {
    sendMessage(){
      if (!this.message.trim()) return;
      const data = {
        message: this.message.trim(),
        type: 'text',
        chat: this.chatChannel.id,
        send_user_id: this.$auth.user.id,
        recipient_user_id: this.valuation.patient.user.id,
        valuation_id: this.valuation.id,
        date: new Date(),
      };
      this.$axios.post("/api/v1/chat-save", data).then(resp =>{
        publishMQTT(this.chatChannel.chat_key, data).then(() => {
          this.message = '';
        });
      }).catch(e =>{
        this.$toast.error("Error al enviar el mensaje. Consulte a soporte SaludWom");
      });
    },
    addMessageBottom(message) {
      this.messages.push(message);
      this.toBottom();
    },
    toTop() {
      const element = document.querySelector(".vs-sidebar--items");
      let resp = this
      element.addEventListener('scroll', function () {
        if (element.scrollTop === 0) {
          setTimeout(() => {
            console.log(resp.page)
            if (resp.page <= resp.pageSize) {
              resp.page++;
              resp.getMessages()
            } else {
              resp.finished = true
            }
          }, 100)
        }
      });
    },
    toBottom(transition = true) {
      const element = document.querySelector(".vs-sidebar--items");
      setTimeout(() => {
        const params = {
          top: element.scrollHeight,
        };
        if (transition) {
          params.behavior = "smooth";
        }
        element.scrollTo(params);
      }, 50);
    },
    formatDate(date) {
      return this.$moment(date).tz(this.timezoneUser).format('llll')
    },
    getUnreadMessages() {
      if (this.openChat === true){
        return
      }
      this.$axios.get(`api/v1/get-unread-message/${this.valuation.chat.id}`).then(resp => {
        this.unreadMessages = resp.data.data
      }).catch(e => {
        console.log(e)
      })
    },
    messageReadAt(){
      this.$axios.post(`api/v1/message-read-at/${this.valuation.chat.id}`).then(resp => {
      }).catch(e => {
        console.log(e)
      })
    },
    getMessages(){
      this.$axios.get(`api/v1/get-messages-valoration/${this.valuation.chat.id}/?page=${this.page}`).then(resp =>{
        this.chatChannel = resp.data.chatChannel
        resp.data.data.data.forEach((message) => {
          this.messages.unshift({
            message: message.message,
            type: message.type,
            chat: message.chat_channel_id,
            send_user_id: message.send_user_id,
            recipient_user_id: message.recipient_user_id,
            date: message.created_at,
          })
        })
        this.pageSize = resp.data.lastPage
          // this.messages.unshift(resp.data.data.data)
      }).catch(e =>{
        console.log('ERROR', e);
        this.$toast.error("Error al obtener los mensajes. Consulte a soporte SaludWom");
        this.$vs.loading.close()
      })
    },
    funcOpenChat() {
      // this.messages = []
        this.openChat = true
        this.unreadMessages = 0
        this.toBottom();
      if (this.messages && this.messages.length === 0){
        this.getMessages()
      }
    },
    async subscribeMqttMessage(){
      await subscriberMQTT("chat", this.chatChannel.chat_key, (message) => {
        if (message){
          if (this.openChat === false) {
            this.unreadMessages++
          }else if (this.openChat === true){
            this.messageReadAt()
            this.addMessageBottom(JSON.parse(message));
          }
        }
      });
    }
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
    this.toTop()
    this.subscribeMqttMessage()
  },
  watch: {
    'openChat': function (val) {
      if (!val) {
        if (this.pageSize === 1){
          this.pageSize = 1
        }
        this.page = 1
        this.finished = false
      }
    }
  }
}
</script>

<style scoped>

</style>
