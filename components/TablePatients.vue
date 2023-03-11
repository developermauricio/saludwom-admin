<template>
  <div>
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Pacientes</h4>
        <div class="d-flex align-items-center">

          <!--=====================================
              FILTRAR POR TIPO
         ======================================-->
          <div class="mr-3">
            <label class="form-label" for="basicSelect">Filtar por Tipo</label>
            <select v-model="filters.valueType" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option value="client">Cliente</option>
              <option value="courtesy">Cortesia</option>
            </select>
          </div>
          <!--=====================================
               FILTRAR GÉNERO
          ======================================-->
          <div class="mr-3">
            <label class="form-label" for="basicSelect">Filtar por Género</label>
            <select v-model="filters.valueGender" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option v-for="gender in genders" :key="gender.id" :value="gender.id">
                {{ gender.name }}
              </option>
            </select>
          </div>
          <!--=====================================
           BUSCAR PACIENTE
         ======================================-->
          <div class="mr-4">
            <label class="form-label">Buscar por nombre, correo o documento</label>
            <input v-model="valueSearchPatient" v-on:keyup.enter="search" type="text" class="form-control search-patients" placeholder="Buscar paciente...">
          </div>
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
          TABLA PACIENTES
        ======================================-->
        <div class="table-responsive" v-if="patients.length > 0">
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
              row-key-field-name="rowKey"
              :event-custom-option="eventCustomOption"
              :columns="columnsTable"
              :table-data="tableData"/>
            <div class="table-pagination mt-2" v-if="patients.length > 10">
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

export default {
  name: "TablePatients",
  data() {
    return {
      genders: [],
      filters:{
        valueGender: null,
        valueType: null
      },

      valueSearchPatient: String(),
      messageIsPatients: false,
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
              alert('CLICK')
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
      columnsTable: [
        {
          type: "checkbox",
          field: "",
          key: "a",
          title: "#",
          width: "5%",
          align: "center",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return ++rowIndex;
          },
        },
        {
          field: "name",
          // sortBy: "",
          key: "name",
          title: "Nombre",
          align: "left",
          width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mr-2 d-flex">
                <div>
                  <img width="40" src={this.$config.urlBack + row.picture} alt=""/>
                </div>

                <vs-tooltip text={row.country} position="left" style="cursor:pointer" class="my-auto">
                  <img class="mx-1" width="20" src={row.country_flag} alt=""/>
                </vs-tooltip>
              </div>
              <div class="mt-2">
                <h5>{row.name}</h5>
                <p className="text-black-50">{row.email}</p>
              </div>
            </div>

          },
        },
        {field: "document", key: "document", title: "Documento", align: "center", width: "10%"},
        {field: "document_type", key: "document_type", title: "Tipo de Documento", align: "center", width: "10%"},
        {field: "phone", key: "phone", title: "Teléfono", align: "center", width: "8%"},
        {field: "gender", key: "gender", title: "Género", align: "center", width: "10%"},
        {field: "age", key: "age", title: "Edad", align: "center", width: "5%"},
        {field: "patientType", key: "patientType", title: "Tipo", align: "center", width: "5%",
          renderBodyCell: ({row, column, rowIndex}, h) => {

            switch (row.patient_type) {
              case 'client':
                return <p>Cliente</p>
              case 'courtesy':
                return <p>Cortesia</p>
            }

          },
        },

      ],
      pageIndex: 1,
      pageSize: 10,
      /*Data information*/
      checked: [],
      urlExportExcel: '',
      selectedPatients: [],
    }
  },
  props: ['patients'],
  methods: {
    getGenders(){
      this.$axios.get('/api/v1/get-genders').then(resp =>{
        this.genders = resp.data.data
      }).catch(e =>{
        console.log(e)
        this.$toast.error("Al obtener los géneros. Consulte con el administrador.");
      })
    },
    search() {
      const searchValue = this.valueSearchPatient;
      let exist = []
      if (searchValue) {
        exist = this.patients.filter(
          (x) =>
            !searchValue.length ||
            x.name.toLowerCase().includes(searchValue.toLowerCase()) || x.email.toLowerCase().includes(searchValue.toLowerCase()) || x.document.toLowerCase().includes(searchValue.toLowerCase()),
        );
        if (exist.length > 0) {
          this.$emit('searchPatients', exist)
        } else {
          this.$toast.error("El paciente no se encuentra registrado o no ha asido asignado al doctor.");
        }
      } else {
        this.$emit('updateGetPatients')
      }
    },
    sortChange(params) {
      this.patients.sort((a, b) => {
        if (params.name) {
          if (params.name === "asc") {
            if (a.name < b.name) //sort string ascending
              return -1;
          } else if (params.brand === "desc") {
            if (a.name > b.name)
              return -1;
          } else {
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
    // reset selectedRowKeys
    resetSelectedRowKeys() {
      this.checkboxOption.selectedRowKeys = [];

      const selectedRowKeysCollection = this.selectedPatients;

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
        this.selectedPatients.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedPatients.splice(index, 1);
      }
    },
    // select all change
    changeSelectAll(isSelected, selectedRowKeys) {
      this.selectedPatients = []
      this.checkboxOption.selectedRowKeys = selectedRowKeys;

      if (isSelected) {
        this.selectedPatients =
          this.selectedPatients.concat(selectedRowKeys);
      } else {
        this.tableData.forEach((item) => {
          const index = this.selectedPatients.indexOf(item.id)
          console.log(index)
          if (index > -1) {
            this.selectedPatients.splice(index, 1);
          }
        });
      }
    },

  },
  watch: {
    valueSearchPatient: function (value) {
      if (!value) {
        this.$emit('updateGetPatients')
      }
    },
    filters: {
      handler(val){
        setTimeout(() =>{
          if (val){
            this.$emit('filters', val)
          }
        }, 200)
      },
      deep: true
    },
  },
  mounted() {
    this.getGenders();
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.patients.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.patients.length;
    },
  },
}
</script>

<style scoped>

</style>
