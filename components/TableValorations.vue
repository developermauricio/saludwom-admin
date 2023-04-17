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
            FILTRAR POR TIPO
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
         BUSCAR PACIENTE
       ======================================-->
        <div class="mr-4 mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label">Buscar por nombre, correo o documento</label>
          <input v-model="valueSearchValoration" v-on:keyup.enter="search" type="text" class="form-control search-patients" placeholder="Buscar...">
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
      plans: [],
      filters: {
        valueGender: null,
        valuePlan: null,
        valueState: null
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
              this.$router.push({ path: `/objetivos/${row.valoration_slug}`})
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
          width: "5%",
          align: "center",
        },
        {field: "valoration_name", key: "valoration_name", title: "Nombre Objetivo", align: "left", width: "18%"},
        {
          field: "name",
          key: "name",
          title: "Nombre Paciente",
          align: "left",
          width: "25%",
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
        {
          field: "valoration_state", key: "valoration_state", title: "Estado", align: "center", width: "20%",
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
        {field: "gender", key: "gender", title: "Género", align: "center", width: "10%"},
        {field: "age", sortBy: "", key: "age", title: "Edad", align: "center", width: "8%"},
        {field: "valoration_suscription", key: "valoration_suscription", title: "Suscripción", align: "center", width: "10%"},
        {field: "document", key: "document", title: "Documento Paciente", align: "center", width: "10%"},
        {
          field: "valoration_created_at",
          key: "valoration_created_at",
          title: "Fecha Registro",
          align: "left",
          width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return this.$moment(row.valuation_created_at ).tz(this.timezoneUser).format('DD MMMM YYYY')
          },
        },

      ],
      pageIndex: 1,
      pageSize: 10,
      /*Data information*/
      checked: [],
      urlExportExcel: '',
      selectedValorations: [],
    }
  },
  props: ['valorations', 'messageIsValuations'],
  methods: {
    getGenders() {
      this.$axios.get('/api/v1/get-genders').then(resp => {
        this.genders = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los géneros. Consulte a soporte SaludWom.");
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
          this.$toast.error("El paciente no se encuentra registrado o no ha asido asignado al doctor.");
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
      if (this.dateFilter){
        let dateStart = this.dateFilter.start
        let dateEnd = this.dateFilter.end
        if (dateStart && dateEnd) {
          this.$emit('filterDate', this.dateFilter)
          // this.get(this.dateFilter)
        } else {
          this.$toast.error("No se pudo filtrar. Tenga en cuenta seleccionar la fecha final.");
        }
      }else{
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
        setTimeout(() =>{
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
    this.getGenders();
    this.getPlans();
  },
  created() {
    this.timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone
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
