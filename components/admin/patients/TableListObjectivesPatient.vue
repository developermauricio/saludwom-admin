<template>
  <div>
    <!--=====================================
        TABLA OBJETIVOS
      ======================================-->
    <div class="table-responsive" v-if="valorations.length > 0 && !messageIsValuations">
      <client-only>
        <ve-table
          id="loading-container"
          :scroll-width="1200"
          border-y
          :row-style-option="rowStyleOption"
          fixed-header
          :sort-option="sortOption"
          :max-height="500"
          :checkbox-option="checkboxOption"
          row-key-field-name="valoration_id"
          :event-custom-option="eventCustomOption"
          :columns="columnsTable"
          :table-data="tableData"/>
        <div class="table-pagination mt-2" v-if="valorations.length > 10">
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
</template>

<script>
export default {
  name: "TableListObjectivesPatient",
  props: ['valorations', 'messageIsValuations'],
  data() {
    return {
      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            dblclick: (event) => {
              this.$FModal.hide()
              this.$router.push({path: `/objetivos/${row.slug}`})
            },
          };
        },
      },
      columnsTable: [
        {
          // type: "checkbox",
          field: "sequence_number",
          key: "index",
          title: "#",
          width: "4%",
          align: "center",
        },

        {
          field: "name", key: "name", title: "Nombre Objetivo", align: "left", width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href={"/objetivos/" + row.slug}>
              <div class="d-flex align-items-center">
                <div class="mt-2">
                  <p>{row.name}</p>
                </div>
              </div>
            </a>

          },
        },
        {
          field: "doctor",
          key: "doctor",
          title: "Especialista",
          align: "left",
          width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mt-2">
                <p>Esp. {row.doctor.user.name} {row.doctor.user.last_name}</p>
              </div>
            </div>

          },
        },
        {
          field: "treatment",
          key: "treatment",
          title: "Tratamiento",
          align: "left",
          width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mt-2">
                <p>{row.treatment.treatment}</p>
              </div>
            </div>
          },
        },
        {
          field: "state", key: "state", title: "Estado", align: "center", width: "15%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.state) {
              case '1':
                return <span class="badge bg-warning">Pend. Enviar recursos</span>
              case '2':
                return <span class="badge bg-info">Recursos enviados</span>
              case '3':
                return <span class="badge bg-danger">Pend. Enviar tratamiento</span>
              case '4':
                return <span class="badge bg-primary">En tratamiento</span>
              case '5':
                return <span class="badge bg-success">Finalizado</span>
            }
          },
        },
        {
          field: "created_at",
          key: "created_at",
          title: "Fecha Registro",
          align: "left",
          width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return this.$moment(row.created_at).format('DD MMMM YYYY')
          },
        },

      ],

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
      checkboxOption: {
        selectedRowKeys: [],

        selectedRowChange: ({row, isSelected, selectedRowKeys}) => {
          this.changeSelectedRowKeys(row, isSelected);
        },

        selectedAllChange: ({isSelected, selectedRowKeys}) => {
          this.changeSelectAll(isSelected, selectedRowKeys);
        },
      },

      pageIndex: 1,
      pageSize: 10,
      /*Data information*/
      checked: [],
      urlExportExcel: '',
      selectedValorations: [],
    }
  },
  methods: {
    // reset selectedRowKeys
    resetSelectedRowKeys() {
      this.checkboxOption.selectedRowKeys = [];

      const selectedRowKeysCollection = this.selectedValorations;

      if (selectedRowKeysCollection.length) {
        this.tableData.forEach((item) => {
          if (selectedRowKeysCollection.indexOf(item.rowKey) > -1) {
            this.checkboxOption.selectedRowKeys.push(item.rowKey);
          }
        });
      }
    },
    // selected rowKeys change
    changeSelectedRowKeys(row, isSelected) {
      const rowKey = row.rowKey;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey);
        this.selectedValorations.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedValorations.splice(index, 1);
      }
    },
    // select all change
    changeSelectAll(isSelected, selectedRowKeys) {
      this.selectedValorations = []
      this.checkboxOption.selectedRowKeys = selectedRowKeys;

      if (isSelected) {
        this.selectedValorations =
          this.selectedValorations.concat(selectedRowKeys);
      } else {
        this.tableData.forEach((item) => {
          const index = this.selectedValorations.indexOf(item.id)
          console.log(index)
          if (index > -1) {
            this.selectedValorations.splice(index, 1);
          }
        });
      }
    },
    sortChange(params) {
      this.valorations.sort((a, b) => {
        if (params.age) {
          if (params.age === "asc") {
            if (a.age < b.age) //sort string ascending
              return -1;
          } else if (params.age === "desc") {
            if (a.age > b.age)
              return -1;
          } else {
            this.$emit('updateGetPatients')
            return 0;
          }
        }
      });
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
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.valorations.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.valorations.length;
    },
  },
}
</script>

<style scoped>

</style>
