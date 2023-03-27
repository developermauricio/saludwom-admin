<template>
  <div class="pt-3">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Cuestionarios</h4>
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
      questionnaires: [],

      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },
      sortOption: {
        sortChange: (params) => {
          console.log("sortChange::", params);
          this.sortChange(params);
        },
      },
      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            dblclick: (event) => {
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
          };
        },
      },
      columnsTable: [
        {field: "name", key: "name", title: "Nombre Cuestionario"},
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
      ],
      pageIndex: 1,
      pageSize: 10,
    }
  },
  methods: {
    getQuestionnaire() {
      this.$axios.get('/api/v1/get-questionnaires').then(resp => {
        this.questionnaires = resp.data.data
      }).catch(e => {
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
  mounted() {
    bus.$on('updateTableQuestionnaire', () =>{
      this.getQuestionnaire();
    })
    this.getQuestionnaire();
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.questionnaires.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
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
