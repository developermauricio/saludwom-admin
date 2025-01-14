<template>
  <div class="mt-2">
    <div class="card">
      <div class="card-header d-block">
        <div class="d-flex justify-content-between">
          <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Pacientes</h4>
          <!--=====================================
            EXPORTAR DATOS
          ======================================-->
          <div>
            <button class="btn btn-success w-100 mt-2" @click="exportExcel">Exportar Excel</button>
          </div>
        </div>

        <div class="d-md-flex d-lg-flex align-items-center justify-content-end mt-2">

          <!--=====================================
		            FILTRAR POR FECHA
         ======================================-->
          <div class="mr-lg-3 mr-md-3 mt-1">
            <label class="form-label">Filtrar por fecha</label>
            <vue-ctk-date-time-picker
              v-model="dateFilter"
              :label="'Seleccionar fecha'"
              :name="'Date'"
              :format="'YYYY-MM-DD'"
              :formatted="'DD MMM, YYYY'"
              :only-date="true"
              :data-vv-as="'date'"
              :input-size="'md'"
              :first-day-of-week="1"
              :color="'#02B8BF'"
              :custom-shortcuts="customShortcuts"
              :dark="calendarIsDark"
              :range="true"
              @validate="filterCalendar"
            ></vue-ctk-date-time-picker>
          </div>


          <!--=====================================
              FILTRAR SOLO LOS QUE TIENE SUSCRIPCIONES
         ======================================-->
          <div class="mr-lg-3 mr-md-3 mt-1">
            <label class="form-label" for="basicSelect">Filtar por suscripción</label>
            <select v-model="filters.valueHasSubscription" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option value="1">Con Suscripción</option>
              <option value="0">Sin Suscripción</option>
            </select>
          </div>

          <!--=====================================
              FILTRAR POR TIPO
         ======================================-->
          <div class="mr-lg-3 mr-md-3 mt-1">
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
          <div class="mr-lg-3 mr-md-3 mt-1">
            <label class="form-label" for="basicSelect">Filtar por Género</label>
            <select v-model="filters.valueGender" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option v-for="gender in genders" :key="gender.id" :value="gender.id">
                {{ gender.name }}
              </option>
            </select>
          </div>


          <!--=====================================
            FILTRAR POR ESTADO
       ======================================-->
          <div class="mr-lg-3 mr-md-3 mt-1 ">
            <label class="form-label" for="basicSelect">Filtrar por estado</label>
            <select v-model="filters.valueState" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
            </select>
          </div>

          <!--=====================================
            FILTRAR POR TIPO DE DOCUMENTO
       ======================================-->
          <div class="mr-lg-3 mr-md-3 mt-1">
            <label class="form-label" for="basicSelect">Filtrar por tipo de documento</label>
            <select v-model="filters.valueDocumentType" class="form-select" id="basicSelect">
              <option value="">Mostrar todos</option>
              <option value="1">DNI (España)</option>
              <option value="2">NIE (España)</option>
              <option value="3">NIF (España)</option>
              <option value="4">Cédula de Ciudadanía</option>
              <option value="5">Cédula de Extranjería</option>
              <option value="6">Pasaporte</option>
            </select>
          </div>

          <!--=====================================
           BUSCAR PACIENTE
         ======================================-->
          <div class="mr-0 mt-1">
            <label class="form-label">Buscar por nombre, correo o documento</label>
            <input v-model="valueSearchPatient" v-on:keyup.enter="search" type="text"
                   class="form-control search-patients" placeholder="Buscar paciente...">
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
              max-height="calc(100vh - 350px)"
              id="loading-container"
              :scroll-width="1200"
              border-y
              :row-style-option="rowStyleOption"
              fixed-header
              :sort-option="sortOption"
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
        <div v-if="messageIsPatients && patients.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CalendarSchedule from "~/components/calendar-doctor/CalendarSchedule.vue";
import ShowPatient from "~/components/admin/patients/ShowPatient.vue";
import fileSaver from 'file-saver';
// import jsFileDownload from 'js-file-download';
export default {
  name: "TablePatients",
  data() {
    return {
      genders: [],
      dateFilter: null,
      filters: {
        valueGender: null,
        valueType: null,
        valueDocumentType: null,
        valueState: null,
        valueHasSubscription: null
      },
      calendarIsDark: false,
      customShortcuts: [
        {key: 'thisWeek', label: 'Esta semana', value: 'isoWeek'},
        {key: 'lastWeek', label: 'Semana pasada', value: '-isoWeek'},
        {key: 'last7Days', label: 'Últimos 7 días', value: 7},
        {key: 'last30Days', label: 'Últimos 30 días', value: 30},
        {key: 'thisMonth', label: 'Este mes', value: 'month'},
        {key: 'lastMonth', label: 'El mes pasado', value: '-month'},
        {key: 'thisYear', label: 'Este año', value: 'year'},
        {key: 'lastYear', label: 'El año pasado', value: '-year'}
      ],

      valueSearchPatient: String(),

      // messageIsPatients: false,
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
              this.showPatient(row)
            },
          };
        },
      },
      checkboxOption: {
        selectedRowKeys: [],
        hideSelectAll: true,
        selectedRowChange: ({row, isSelected, selectedRowKeys}) => {
          this.changeSelectedRowKeys(row, isSelected);
        },

        selectedAllChange: ({isSelected, selectedRowKeys}) => {
          console.log(selectedRowKeys)
          this.changeSelectAll(isSelected, selectedRowKeys);
        },
      },
      columnsTable: [
        {
          type: "checkbox",
          field: "index",
          key: "index",
          title: "#",
          width: "6%",
          align: "center"
        },
        {
          field: "name",
          // sortBy: "",
          key: "name",
          title: "Nombre",
          align: "left",
          width: "30%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href="#" on-click={() => this.showPatient(row)}>
              <div class="d-flex align-items-center">
                <div class="mr-2 d-flex">
                  <div>
                    <img width="40" src={this.userPicture(row)} alt=""/>
                  </div>

                  <vs-tooltip text={row.country.name} position="left" style="cursor:pointer" class="my-auto">
                    <img class="mx-1" width="20" src={row.country_flag} alt=""/>
                  </vs-tooltip>
                </div>
                <div class="mt-2">
                  <h5>{row.name}</h5>
                  <p className="text-black-50">{row.email}</p>
                </div>
              </div>
            </a>
          },
        },
        {field: "document", key: "document", title: "Documento", align: "left", width: "15%"},
        {
          field: "document_type", key: "document_type", title: "Tipo de Documento", align: "left", width: "13%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div>
              <p>{row.documentType.name}</p>
            </div>
          }
        },
        // {field: "phone", key: "phone", title: "Teléfono", align: "left", width: "15%"},
        {
          field: "state", key: "state", title: "Estado", align: "center", width: "8%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            // switch (row.state) {
            //   case '1':
            //     return <span class="badge bg-success">Activo</span>
            //   case '2':
            //     return <span class="badge bg-danger">Inactivo</span>
            // }
            if (row.state == '1') {
              return <span class="badge bg-success">Activo</span>
            }

            if (row.state == '2') {
              return <span class="badge bg-danger">Inactivo</span>
            }
          },
        },
        {
          field: "gender", key: "gender", title: "Género", align: "left", width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div>
              <p>{row.gender.name}</p>
            </div>
          }
        },
        {field: "age", key: "age", title: "Edad", align: "center", width: "6%"},
        {
          field: "patientType", key: "patientType", title: "Tipo", align: "left", width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {

            switch (row.patientType) {
              case 'client':
                return <p>Cliente</p>
              case 'courtesy':
                return <p>Cortesía</p>
            }

          },
        },
        {
          field: "created_at",
          key: "created_at",
          title: "Fecha Registro",
          align: "left",
          width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return this.$moment(row.created_at).format('DD MMMM YYYY')
          },
        },
        // {
        //   field: "",
        //   key: "e",
        //   title: "Acciones",
        //   width: "7%",
        //   center: "left",
        //   renderBodyCell: ({row, column, rowIndex}, h) => {
        //     return (
        //       <span>
        //         <button title="Tooltip directive content"
        //                 class="btn btn-primary btn-sm mr-1"
        //                 on-click={() => this.showPatient(row)}>
        //             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        //                  className="bi bi-eye" viewBox="0 0 16 16">
        //                 <path
        //                   d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        //                 <path
        //                   d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        //             </svg>
        //         </button>
        //       </span>
        //     )
        //   }
        // }
      ],
      pageIndex: 1,
      pageSize: 20,
      /*Data information*/
      checked: [],
      urlExportExcel: '',
      selectedPatients: [],

    }
  },
  props: ['patients', 'messageIsPatients'],

  methods: {
    async exportExcel() {

      this.$vs.loading({
        color: this.$config.colorLoading,
        text: 'Espere por favor...'
      })
      let exportPatients = this.patients

      if (this.selectedPatients.length > 0) {
        exportPatients = this.selectedPatients
      }

      this.$axios.post('/api/v1/get-patients-selected/export', exportPatients, {
        responseType: 'blob'
      }).then(resp => {
        let date = new Date()
        // Extrae el nombre del archivo del encabezado Content-Disposition (si está presente)
        const filename = resp.headers['content-disposition'] || `patients-${this.dateFormatString()}.xlsx`;

        // Crea un blob con los datos binarios del archivo
        const blob = new Blob([resp.data]);

        // Utiliza file-saver para descargar el archivo
        fileSaver.saveAs(blob, filename);

      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al exportar pacientes. Consulte a soporte SaludWom.");
      }).finally(() =>{
        this.$vs.loading.close()
      })
    },
    dateFormatString() {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque en JavaScript los meses van de 0 a 11
      const day = String(currentDate.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    userPicture(patient) {
      if (patient.picture) {
        if (patient.picture.includes('user-profile.png') || patient.picture.includes('storage')) {
          return `${this.$config.urlBack}${patient.picture}`
        }
        // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
        return patient.picture
      }
    },
    showPatient(patient) {

      this.$FModal.show(
        {
          component: ShowPatient,

          placement: 'center center',
        },
        {
          patient: patient,
        }
      )

    },
    getGenders() {
      this.$axios.get('/api/v1/get-genders').then(resp => {
        this.genders = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los géneros. Consulte a soporte SaludWom.");
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
      const rowKey = row;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey.rowKey);
        this.selectedPatients.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey.rowKey);
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
          const index = this.selectedPatients.indexOf(item)
          console.log(index)
          if (index > -1) {
            this.selectedPatients.splice(index, 1);
          }
        });
      }
    },
    filterCalendar() {
      if (this.dateFilter) {
        let dateStart = this.dateFilter.start
        let dateEnd = this.dateFilter.end
        if (dateStart && dateEnd) {
          this.$emit('filterDate', this.dateFilter)
          // this.get(this.dateFilter)
        } else {
          this.$toast.error("No se pudo filtrar. Tenga en cuenta seleccionar la fecha final.");
        }
      } else {
        this.$toast.error("Selecciona un rango de fecha.");
      }
    },

  },
  watch: {

    dateFilter: function (value) {
      if (!value) {
        this.dateFilter = null

        this.$emit('datefilterNull')
        setTimeout(() => {
          this.$emit('updateGetPatients')
        }, 250)
      }
    },
    valueSearchPatient: function (value) {
      if (!value) {
        this.$emit('updateGetPatients')
      }
    },
    filters: {
      handler(val) {
        setTimeout(() => {
          if (val) {
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
