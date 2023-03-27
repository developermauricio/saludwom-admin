<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 col-lg-6">
        <div class="mb-1">
          <label :class="{ 'text-danger': $v.form.question.$error }" class="form-label"
                 for="exampleFormControlTextarea1">Pregunta <span class="text-danger">*</span></label>
          <textarea :class="{ 'is-invalid': $v.form.question.$error }" class="form-control" v-model="form.question"
                    id="exampleFormControlTextarea1" rows="2" placeholder="Pregunta"></textarea>
          <p v-if="$v.form.question.$error" class="text-danger">Agrega la pregunta.</p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-6">
        <!--   Tipo     -->
        <div class="mb-1">
          <label class="form-label" for="exampleFormControlTextarea1" :class="{ 'text-danger': $v.form.type.$error }">Tipo
            <span class="text-danger">*</span> <i @click="openHelpTypeQuestion" style="cursor: pointer" v-html="$feathericons['help-circle'].toSvg()"></i></label>
          <select class="form-select" :class="{ 'is-invalid': $v.form.type.$error }" v-model="form.type"
                  id="basicSelect">
            <option value="">Selecciona</option>
            <option v-for="type in questionsTypes" :key="type.id" :value="type">
              {{ type.name }}
            </option>
          </select>
          <p v-if="$v.form.type.$error" class="text-danger">Selecciona el tipo.</p>
        </div>
        <!--   Pregunta requerida  -->
        <div class="d-flex justify-content-between">
          <div class="form-check form-check-danger">
            <input type="checkbox" v-model="form.required" class="form-check-input" id="colorCheck5">
            <label class="form-check-label" for="colorCheck5">Pregunta Requerida</label>
          </div>
          <div>
            <img v-if="this.form.ilustration" :src="this.form.ilustration.urlResized" width="60" height="60" alt="">
            <a  v-else href="#" @click="addIlustration">Agregar Ilustración</a>
          </div>
        </div>
      </div>
      <!-- Agregar y listar opciones si la pregunta es de tipo select o checkbox -->
      <div class="col-12 col-md-7 col-lg-7 mt-1" v-if="form.type.name === 'select' || form.type.name === 'checkbox'">
        <label class="form-label" for="exampleFormControlTextarea1">Ingresa las opciones del
          {{ form.type.name === 'select' ? 'select' : 'checkbox' }} <span
            class="text-danger">*</span></label>
        <div class="d-flex justify-content-between">
          <input class="form-control" @keyup.enter="addOption" v-model="option" placeholder="Ingresa opción">
          <button class="btn btn-primary btn-sm ml-2" @click="addOption"><i v-html="$feathericons['plus'].toSvg()"></i>
          </button>
        </div>
        <!--  Lista de opciones -->
        <div class="mt-2 w-75">
          <ul>
            <li v-for="(option, index) in form.options">
              <div class="d-flex justify-content-between">
                <p>Opción {{ index + 1 }} <span class="font-weight-bold">{{ option.option }}</span></p>
                <a href="#" @click="removeOption(index)" class="ml-4">Quitar</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-12 d-flex justify-content-end">
        <button class="btn btn-primary" @click="addQuestion">Agregar Pregunta</button>
      </div>
    </div>
  </div>
</template>

<script>
import {required} from "vuelidate/lib/validators";
import ModalAddQuestionnaire from "./ModalAddQuestionnaire";
import AddIlustration from "./AddIlustration";
import {bus} from "../../plugins/bus";
import HelpTypeQuestion from "./HelpTypeQuestion";

export default {
  name: "FormAddQuestion",
  data() {
    return {
      questionsTypes: [],
      option: '',
      form: {
        options: [],
        question: '',
        ilustration: null,
        type: {
        },
        required: false,
      },
      questions: []
    }
  },
  validations: {
    form: {
      question: {required},
      type: {required},
    }
  },
  methods: {
    openHelpTypeQuestion(){
      this.$FModal.show(
        {
          component: HelpTypeQuestion,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center center',
        },
      )
    },
    addIlustration(){
      this.$FModal.show(
        {
          component: AddIlustration,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center center',
        },
      )
    },
    addOption() {
      if (this.option === '') {
        this.$toast.error("Debe agregar un valor al campo.");
        return
      }
      this.form.options.push({
        option: this.option
      })
      this.option = ''
    },
    removeOption(index) {
      this.form.options.splice(index, 1)
    },
    addQuestion() {
      this.$v.form.$touch();
      if (this.$v.$invalid) {
        return
      }
      if (this.form.options.length === 0 && this.form.type.name === 'select') {
        this.$toast.error("Debe agregar un valor en el campo opción.");
        return;
      }
      this.$store.commit('SET_ADD_QUESTIONS', this.form)

      this.$v.form.$reset()
      this.form = {
        options: [],
        question: '',
        ilustration: null,
        type: '',
        required: false,
      }
    },
    getTypesQuestion() {
      this.$axios('api/v1/get-type-questions').then(resp => {
        this.questionsTypes = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los tipos de pregunta. Consulte a soporte SaludWom.");
      })
    }
  },
  mounted() {
    this.getTypesQuestion()
    bus.$on('addIlustration', (data) =>{
      this.form.ilustration = data
    })
  },
  watch: {
    'form.type': function (val) {
      if (val && val.name !== 'select' || val && val.name !== 'checkbox') {
        this.form.options = []
        this.option = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
