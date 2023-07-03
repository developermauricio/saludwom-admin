<template>
  <div class="px-4 resources-questionnaires">
    <div>
      <!-- LOCALIZA TU DOLOR -->
      <div class="mt-2" v-if="resource.enable__touch_data === 1">
        <p><span class="font-weight-bold"></span>Localiza tu dolor.</p>
        <div class="px-5 w-75 m-auto">
          <HumanBody :dataBody="resource.dataBody"/>
        </div>
      </div>
      <!-- CUESTIONARIOS -->
      <div class="row mt-2">
        <p v-if="resource.questionnaires.length > 0">
          Cuestionario{{ resource.questionnaires.length > 1 ? 's' : '' }}.</p>
        <div class="col-12 col-md-4 col-lg-4"
             v-for="(questionnaire, index) in resource.questionnaires" :key="index">
          <div class="card border-1">
            <!--  Icon resuelto  -->
            <div class="d-flex justify-content-end" v-if="questionnaire.solved || questionnaire.resolved">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                   class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16" style="margin-top: -0.6rem">
                <path
                  d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <h5 style="cursor:pointer;">{{ questionnaire.name | truncate(10) }}</h5>
                <a href="#" @click="showQuestionnaire(resource, questionnaire)">Ver cuestionario</a>
              </div>
              <div class="d-flex justify-content-end">
                <span class="badge bg-success ms-2 text-white" v-if="questionnaire.solved || questionnaire.resolved">Resuelto</span>
              </div>
            </div>
            <!--            <div class="card-body">-->
            <!--              Tags:-->
            <!--              <div v-for="(treatment, index) in questionnaire.treatments" :key="index">-->
            <!--                &lt;!&ndash;                <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>&ndash;&gt;-->
            <!--                <ul class="m-0">-->
            <!--                  <li>-->
            <!--                    <p class="font-italic text-muted m-0" style="font-size: 12px">{{ treatment.treatment }}. </p>-->
            <!--                  </li>-->
            <!--                </ul>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
      <!-- RECURSOS DE VIDEOS -->
      <div>
        <div class="mt-2 row" v-if="resource.resource_videos.length > 0">
          <p><span class="font-weight-bold"></span>Recursos de Video.</p>
          <div class="col-12 col-md-4 col-lg-4"
               v-for="(resource, index) in resource.resource_videos" :key="index">
            <div class="card border-1">
              <div class="p-2">
                <div class="content-wrapper cursor-pointer d-flex justify-content-between mb-2">
                  <div @click="openResource(resource)">
                    <a href="#" class="card-text file-name mb-0">{{ resource.name }}</a>
                  </div>
                  <div class="d-flex justify-content-between">

                    <div v-role="'Admin'">
                      <a href="#" id="dropdownMenuCardResource" data-bs-toggle="dropdown" aria-expanded="false">
                        <div v-html="$feathericons['more-vertical'].toSvg()"></div>
                      </a>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuCardResource">
                        <a class="dropdown-item" href="#" @click="openModalEdit(resource)">Actualizar</a>
                        <a class="dropdown-item" href="#">Eliminar</a>
                      </div>
                    </div>
                  </div>

                  <!--        <p class="card-text file-date">01 may 2019</p>-->
                </div>
                <small class="file-accessed">{{
                    resource.description | truncate(20)
                  }}</small>
                <!--        <div class="mt-2">-->
                <!--          <div>-->
                <!--            <div v-for="(treatment, index) in resource.resources_folder_content.treatments" :key="index">-->
                <!--              &lt;!&ndash;            <span class="badge bg-primary ml-1 mt-1">{{ treatment.treatment }}</span>&ndash;&gt;-->
                <!--              <ul class="m-0">-->
                <!--                <li>-->
                <!--                  <p class="font-italic text-muted m-0" style="font-size: 12px">{{ treatment.treatment }}. </p>-->
                <!--                </li>-->
                <!--              </ul>-->
                <!--            </div>-->
                <!--          </div>-->
                <!--        </div>-->
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MENSAJE DEL DOCTOR -->
    <div v-if="resource.message_doctor">
      <p><span class="font-weight-bold"></span>Mensaje por el doctor.</p>
      <p>{{ resource.message_doctor }}</p>
    </div>
  </div>
</template>

<script>

import PreviewResource from "../resources/PreviewResource";
import AnswerQuestionsQuestionnaire from "./resources/AnswerQuestionsQuestionnaire";

export default {
  name: "PreviewResourceTab",
  props: ['resource'],
  methods:{
   async showQuestionnaire(resource, questionnaire) {

      let data = {
        resourceId: resource.id,
        questionnaireId: questionnaire.id
      }

      await this.$store.dispatch('answerQuestionsPatient', data)


      this.$FModal.show(
        {
          component: AnswerQuestionsQuestionnaire,
          clickToClose: false,
          escToClose: false,
          // placement: 'center button',
        },
        {
          questionnaire: questionnaire
        }
      )
    },
    openResource(resource){
      console.log(resource)
      this.$FModal.show(
        {
          component: PreviewResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          dataResource: resource
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
