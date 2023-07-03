<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div>
          <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Especialistas</h4>
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
          TABLA DOCTORES
        ======================================-->
        <div class="table-responsive" v-if="doctors.length > 0 && !messageIsDoctors">
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
              row-key-field-name="doctor_id"
              :event-custom-option="eventCustomOption"
              :columns="columnsTable"
              :table-data="tableData"/>
            <div class="table-pagination mt-2" v-if="doctors.length > 10">
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
        <div v-if="messageIsDoctors && doctors.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ShowDoctor from "./ShowDoctor";

export default {
  name: "TableDoctors",
  data() {
    return {
      columnsTable: [
        {
          // type: "checkbox",
          field: "index",
          key: "index",
          title: "#",
          width: "2%",
          align: "center",
        },
        {field: "name", key: "name", title: "Nombre", align: "center", width: "5%"},
        {
          field: "state", key: "state", title: "Estado", align: "center", width: "2%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.state) {
              case '1':
                return <span class="badge bg-success">Activo</span>
              case '2':
                return <span class="badge bg-danger">Inactivo</span>
            }
          },
        },
        {field: "biography", key: "biography", title: "Biografía", align: "left", width: "20%"},
        {
          field: "",
          key: "e",
          title: "Action",
          width: "5%",
          center: "left",

          renderBodyCell: ({ row, column, rowIndex }, h) => {
            return (
              <span>
                                    <button
                                      class="btn btn-primary btn-sm mr-1"
                                      on-click={() => this.openShowDoctor(row)}
                                    >
                                        Ver
                                    </button>
                &nbsp;
                <button
                  class="btn btn-danger btn-sm mr-1"
                  on-click={() => this.deleteRow(rowIndex)}
                >
                                        Eliminar
                                    </button>
                                </span>
            );
          },
        },
      ],
      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            dblclick: (event) => {
              this.openShowDoctor(row)
            },
          };
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
      sortOption: {
        sortChange: (params) => {
          console.log("sortChange::", params);
          this.sortChange(params);
        },
      },
      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },

      pageIndex: 1,
      pageSize: 10,
      /*Data information*/
      checked: [],
      selectedDoctors: [],
    }
  },
  props: ['doctors', 'messageIsDoctors'],
  methods: {
    openShowDoctor(doctor){
      this.$FModal.show(
        {
          component: ShowDoctor,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center center',
        },
        {
          doctor: doctor
        }
      )
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
    // selected rowKeys change
    changeSelectedRowKeys(row, isSelected) {
      const rowKey = row.rowKey;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey);
        this.selectedDoctors.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedDoctors.splice(index, 1);
      }
    },
    // select all change
    changeSelectAll(isSelected, selectedRowKeys) {
      this.selectedDoctors = []
      this.checkboxOption.selectedRowKeys = selectedRowKeys;

      if (isSelected) {
        this.selectedDoctors =
          this.selectedDoctors.concat(selectedRowKeys);
      } else {
        this.tableData.forEach((item) => {
          const index = this.selectedDoctors.indexOf(item.id)
          console.log(index)
          if (index > -1) {
            this.selectedDoctors.splice(index, 1);
          }
        });
      }
    },
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
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.doctors.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.doctors.length;
    },
  },
}
</script>

<style scoped>

</style>
