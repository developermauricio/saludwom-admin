<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div>
          <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Objetivos Asignados</h4>
        </div>
      </div>
      <div class="d-md-flex d-lg-flex align-items-center justify-content-end px-2">
        <!--=====================================
		            FILTRAR POR FECHA
         ======================================-->
        <div class="mr-2 px-1">
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
             FILTRAR DOCTOR
        ======================================-->
        <div class="mr-3  mt-1 px-1 m-md-0 m-lg-0" v-if="$auth.user.roles[0].name === 'Admin'">
          <label class="form-label" for="basicSelect">Filtrar por Esp.</label>
          <select v-model="filters.valueDoctor" class="form-select" id="basicSelect">
            <option value="">Mostrar todos</option>
            <option v-for="(doctor, index) in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.user.name }}  {{ doctor.user.last_name }}
            </option>
          </select>
        </div>
        <!--=====================================
            FILTRAR POR ESTADO
       ======================================-->
        <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label" for="basicSelect">Filtrar por estado</label>
          <select v-model="filters.valueState" class="form-select" id="basicSelect">
            <option value="">Mostrar todos</option>
            <option value="1">Pendiente de enviar recursos</option>
            <option value="2">Recursos enviados</option>
            <option value="3">Pendiente de enviar el tratamiento</option>
            <option value="4">En tratamiento</option>
            <option value="5">Finalizado</option>
          </select>
        </div>
        <!--=====================================
            FILTRAR POR SUSCRIPCIÓN
       ======================================-->
        <div class="mr-3  mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label" for="basicSelect">Filtrar por suscripción</label>
          <select v-model="filters.valuePlan" class="form-select" id="basicSelect">
            <option value="">Mostrar todos</option>
            <option v-for="(plan, index) in plans" :key="plan.id" :value="plan.id">
              {{ plan.name }}
            </option>
          </select>
        </div>
        <!--=====================================
             FILTRAR GÉNERO
        ======================================-->
        <div class="mr-3  mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label" for="basicSelect">Filtrar por género</label>
          <select v-model="filters.valueGender" class="form-select" id="basicSelect">
            <option value="">Mostrar todos</option>
            <option v-for="(gender, index) in genders" :key="gender.id" :value="gender.id">
              {{ gender.name }}
            </option>
          </select>
        </div>
        <!--=====================================
         BUSCAR VALORACIONES
       ======================================-->
        <div class="mr-4 mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label">Buscar</label>
          <input v-model="valueSearchValoration" v-on:keyup.enter="search" type="text"
                 class="form-control search-patients" placeholder="Buscar...">
        </div>
      </div>
      <div class="card-body">
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
              max-height="calc(100vh - 350px)"
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
        <div v-if="messageIsValuations && valorations.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableValorations",
  data() {
    return {
      timezoneUser: null,
      genders: [],
      doctors: [],
      plans: [],
      filters: {
        valueGender: null,
        valuePlan: null,
        valueState: null,
        valueDoctor: null,
      },
      dateFilter: null,
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
      valueSearchValoration: String(),
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
              this.$router.push({path: `/objetivos/${row.valoration_slug}`})
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
          // type: "checkbox",
          field: "index",
          key: "index",
          title: "#",
          width: "8%",
          align: "center",
        },
        {
          field: "valoration_name", key: "valoration_name", title: "Nombre Objetivo", align: "left", width: "25%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href={"/objetivos/" + row.valoration_slug}>
              <div class="d-flex align-items-center">
                <div class="mt-2">
                  <p>{row.valoration_name}</p>
                </div>
              </div>
            </a>
          },
        },
        {
          field: "name",
          key: "name",
          title: "Nombre Paciente",
          align: "left",
          width: "50%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mr-2 d-flex">
                <div>
                  <img width="40" src={this.userPicture(row)} alt=""/>
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
        {
          field: "valoration_state", key: "valoration_state", title: "Estado", align: "center", width: "30%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.valoration_state) {
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
        {field: "gender", key: "gender", title: "Género", align: "left", width: "15%"},
        // {field: "age", sortBy: "", key: "age", title: "Edad", align: "center", width: "10%"},
        {
          field: "valoration_suscription",
          key: "valoration_suscription",
          title: "Suscripción",
          align: "left",
          width: "15%"
        },
        // {field: "document", key: "document", title: "Documento", align: "center", width: "25%"},
        {
          field: "doctor", key: "doctor", title: "Especialista", align: "left", width: "25%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mt-2">
                <p>Esp. {row.doctor}</p>
              </div>
            </div>
          },
        },
        {
          field: "valoration_created_at",
          key: "valoration_created_at",
          title: "Fecha Registro",
          align: "left",
          width: "20%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return this.$moment(row.valoration_created_at).format('DD MMMM YYYY')
          },
        },
        // {
        //   field: "",
        //   key: "e",
        //   title: "Acciones",
        //   width: "13%",
        //   center: "left",
        //   renderBodyCell: ({row, column, rowIndex}, h) => {
        //     return (
        //       <span>
        //         <button title="Tooltip directive content"
        //                 class="btn btn-primary btn-sm mr-1"
        //                 on-click={() => this.showPatient(row)}>
        //             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
        //                 <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        //                 <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
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
      selectedValorations: [],
    }
  },
  props: ['valorations', 'messageIsValuations'],
  methods: {
    userPicture(patient) {

      if (patient.picture.includes('user-profile.png') || patient.picture.includes('storage')) {
        return `${this.$config.urlBack}${patient.picture}`
      }
      // Verifica si hay una imagen de usuario y devuelve la URL correspondiente
      return patient.picture
    },
    showPatient(row){
      this.$router.push({path: `/objetivos/${row.valoration_slug}`})
    },
    getGenders() {
      this.$axios.get('/api/v1/get-genders').then(resp => {
        this.genders = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los géneros. Consulte a soporte SaludWom.");
      })
    },
    getPlans() {
      this.$axios.get('/api/v1/get-plans').then(resp => {
        this.plans = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los planes. Consulte a soporte SaludWom.");
      })
    },
    getDoctors() {
      this.$axios.get('/api/v1/get-doctors').then(resp => {
        this.doctors = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener los planes. Consulte a soporte SaludWom.");
      })
    },
    search() {
      const searchValue = this.valueSearchValoration;
      let exist = []
      if (searchValue) {
        exist = this.valorations.filter(
          (x) =>
            !searchValue.length ||
            x.name.toLowerCase().includes(searchValue.toLowerCase()) || x.email.toLowerCase().includes(searchValue.toLowerCase())
            || x.document.toLowerCase().includes(searchValue.toLowerCase()) || x.valoration_name.toLowerCase().includes(searchValue.toLowerCase())
          ,
        );
        if (exist.length > 0) {
          this.$emit('searchPatients', exist)
        } else {
          this.$toast.error("El paciente no se encuentra registrado o no ha asido asignado por un especialista.");
        }
      } else {
        this.$emit('updateGetPatients')
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

  },
  watch: {
    dateFilter: function (value) {
      if (!value) {
        this.dateFilter = null
        // this.selectedStudents = []
        this.$emit('datefilterNull')
        setTimeout(() => {
          this.$emit('updateGetPatients')
        }, 250)

        // this.getStudents()
      }
    },
    valueSearchValoration: function (value) {
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
    this.getGenders()
    this.getPlans()
    this.getDoctors()
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
