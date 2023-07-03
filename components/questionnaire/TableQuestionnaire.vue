<template>
  <div class="pt-3">
    <div class="card">
      <div class="d-flex justify-content-between mt-2">
        <div class="card-header d-flex justify-content-between">
          <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Cuestionarios</h4>
        </div>
        <div class="d-md-flex d-lg-flex align-items-center justify-content-end px-2">
          <!--=====================================
               FILTRAR TRATAMIENTO
          ======================================-->
          <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label" for="basicSelect">Filtrar por Tratamiento</label>
            <select class="form-select" v-model="valueTreatment">
              <option value="">Mostrar todos</option>
              <option v-for="(treatment, index) in treatments" :key="treatment.id" :value="treatment.id">
                {{ treatment.treatment }}
              </option>
            </select>
          </div>
          <!--=====================================
               BUSCAR
          ======================================-->
          <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label" for="basicSelect">Buscar Cuestionario</label>
            <input v-model="valueSearchQuestionnaire" type="text" placeholder="Buscar..."
                   class="form-control">
          </div>
        </div>
      </div>

      <div class="card-body">
        <!--=====================================
          TABLA CUESTIONARIOS
        ======================================-->
        <div class="table-responsive" v-if="questionnaires.length > 0">
          <client-only>
            <ve-table
              id="loading-container"
              :scroll-width="1200"
              border-y
              :row-style-option="rowStyleOption"
              fixed-header
              :sort-option="sortOption"
              :max-height="500"
              row-key-field-name="rowKey"
              :event-custom-option="eventCustomOption"
              :columns="columnsTable"
              :table-data="tableData"/>
            <div class="table-pagination mt-2" v-if="questionnaires.length > 10">
              <ve-pagination
                :total="totalCount"
                :page-index="pageIndex"
                :page-size="pageSize"
                @on-page-number-change="pageNumberChange"
                @on-page-size-change="pageSizeChange"
              />
            </div>
          </client-only>
        </div>
        <div v-if="messageIsQuestionnaires && questionnaires.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from "../../plugins/bus";
import ModalAddQuestionnaire from "./ModalAddQuestionnaire";
import ModalUpdateQuestionnaire from "./ModalUpdateQuestionnaire";

export default {
  name: "TableQuestionnaire",
  data() {
    return {
      valueSearchQuestionnaire: '',
      questionnaires: [],
      treatments: [],
      valueTreatment: '',
      messageIsQuestionnaires: false,
      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },
      sortOption: {
        sortChange: (params) => {
          this.sortChange(params);
        },
      },
      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            click: (event) => {
              // this.openModalDetail(row)
            },
          };
        },
      },
      columnsTable: [
        {field: "name", key: "name", title: "Nombre Cuestionario", width: "20%"},
        {
          field: "treatment", key: "treatment", title: "Tratamientos", width: "30%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return row.treatments.map((item) => {
              return <span class="badge bg-primary ml-1 mt-1">{item.treatment}</span>
            })
          },
        },
        {
          field: "state", key: "state", title: "Estado", width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.state) {
              case '1':
                return <span class="badge bg-success">Activo</span>
              case '2':
                return <span class="badge bg-danger">Inactivo</span>
            }
          },
        },
        {field: "created_at_format", key: "created_at_format", title: "Fecha de Registro"},
        {field: "update_at_format", key: "update_at_format", title: "Fecha Última Actualización"},
        {
          field: "button", key: "button", title: "Acciones", width: "15%", align: "center",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (
              <span class="d-flex justify-content-center">
                <button class="btn btn-primary btn-sm" on-click={() =>
                  this.openModalDetail(row)
                }>Ver</button>
                &nbsp;
                <button class="btn btn-danger btn-sm" on-click={() =>
                  this.deleteQuestionnaire(row)
                }>Eliminar</button>
              </span>
            )
          },
        },
      ],
      pageIndex: 1,
      pageSize: 10,
    }
  },
  methods: {
    getTreatments() {
      this.$axios.get('api/v1/get-treatments').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los tratamientos. Consulte a soporte SaludWom.");
      })
    },
    deleteQuestionnaire(row) {
      console.log(row)
      this.$swal.fire(
        {
          title: `¿Esta seguro de eliminar el cuestionario "${row.name}"?`,
          icon: 'warning',
          confirmButtonText: 'Estoy seguro',
          cancelButtonText: 'No',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary mr-2'
          },

          buttonsStyling: false,
          showCancelButton: true,
          reverseButtons: true,
          allowOutsideClick: false,
        }).then(async result => {
        if (result.value) {
          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })
          this.$axios.post(`api/v1/delete-questionnaire/${row.id}`).then(resp => {
            if (resp.status === 201){
              this.$toast.error("No se puede eliminar el cuestionario, esta en uso. Consulte a soporte SaludWom.");
            }else{
              this.$toast.success("El cuestionario se eliminó correctamente.");
              this.getQuestionnaire();
            }
            this.$vs.loading.close()
          }).catch(e => {
            this.$vs.loading.close()
            console.log(e)
            this.$toast.error("Error al eliminar el cuestionario. Consulte a soporte SaludWom.");
          })
        }
      })
    },
    openModalDetail(row) {
      this.$FModal.show(
        {
          component: ModalUpdateQuestionnaire,
          clickToClose: false,
          escToClose: false,
          placement: 'center center',
        },
        {
          questionnaire: row
        }
      )
    },
    getQuestionnaire() {
      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      this.$axios.get(`/api/v1/get-questionnaires/?treatmentId=${this.valueTreatment}`).then(resp => {
        this.questionnaires = resp.data.data
        this.$vs.loading.close()
        if (this.questionnaires.length === 0) {
          return this.messageIsQuestionnaires = true
        }

      }).catch(e => {
        this.$vs.loading.close()
        console.log(e)
        this.$toast.error("Al obtener los cuestionarios. Consulte a soporte SaludWom.");
      })
    },
    // page number change
    pageNumberChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.resetSelectedRowKeys();
    },
    // page size change
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    },
  },
  created() {
    bus.$on('updateTableQuestionnaire', () => {
      this.getQuestionnaire();
    })
  },
  mounted() {
    this.getTreatments()
    this.getQuestionnaire();
  },
  watch: {
    valueTreatment: function (val) {
      console.log(val)
      this.getQuestionnaire()
    }
  },
  computed: {
    // questionnairesFilter() {
    //   if (this.valueSearchQuestionnaire) {
    //     let questions = this.questionnaires.filter(questionnaire => questionnaire.name.toLowerCase().includes(this.valueSearchQuestionnaire.toLowerCase()))
    //     return  questions.slice()
    //   }
    //   return this.questionnaires
    // },
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      if (this.valueSearchQuestionnaire) {
        let questions = this.questionnaires.filter(questionnaire => questionnaire.name.toLowerCase().includes(this.valueSearchQuestionnaire.toLowerCase()))
        return questions.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
      }
      return this.questionnaires.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    },
    // total count
    totalCount() {
      return this.questionnaires.length;
    },
  },
}
</script>

<style scoped>

</style>
