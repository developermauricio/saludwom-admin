<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div>
          <h4 class="card-title mb-2 mb-md-0 mb-lg-0">Lista de Ordenes de Compra</h4>
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
          FILTRAR POR PLAN
     ======================================-->
        <div class="mr-3  mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label" for="basicSelect">Filtrar por plan</label>
          <select v-model="filters.valuePlan" class="form-select" id="basicSelect">
            <option value="">Mostrar todos</option>
            <option v-for="(plan) in plans" :key="plan.id" :value="plan.id">
              {{ plan.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
          TABLA SUBSCRIPCIONES
        ======================================-->
        <div class="table-responsive" v-if="orders.length > 0 && !messageIsOrders">
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
              row-key-field-name="order_id"
              :event-custom-option="eventCustomOption"
              :columns="columnsTable"
              :table-data="tableData"/>
            <div class="table-pagination mt-2" v-if="orders.length > 10">
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
        <div v-if="orders && orders.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShowOrder from "@/components/admin/orders/ShowOrder.vue";

export default {
  name: "TableOrders",
  props: ['orders', 'messageIsOrders'],
  data() {
    return {
      plans: [],
      valueSearchOrders: String(),
      dateFilter: null,
      calendarIsDark: false,
      filters: {
        valuePlan: null,
        valueState: null,
      },
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

      columnsTable: [
        {
          // type: "checkbox",
          field: "index",
          key: "index",
          title: "# Orden",
          align: "center",
        },
        {field: "orden_plan_name", key: "orden_plan_name", title: "Plan", align: "left"},
        {
          field: "orden_state", key: "orden_state", title: "Estado", align: "center",
          renderBodyCell: ({row}, ) => {
            switch (row.orden_state) {
              case '1':
                return <span class="badge bg-warning">Pendiente</span>
              case '2':
                return <span class="badge bg-danger">Cancelado</span>
              case '3':
                return <span class="badge bg-danger">Rechazado</span>
              case '4':
                return <span class="badge bg-success">Aceptado</span>
            }
          },
        },
        {
          field: "orden_price", key: "orden_price", title: "Precio", align: "left",
          renderBodyCell: ({row}) => {
            return (row.orden_price.value).toFixed(2) + '€'
          }
        },
        {
          field: "orden_created_at",
          key: "orden_created_at",
          title: "Fecha Registro",
          align: "left",
          renderBodyCell: ({row}) => {
            return this.$moment(row.orden_created_at).format('DD MMMM YYYY')
          },
        },
        {
          field: "",
          key: "e",
          title: "Acciones",
          center: "left",
          renderBodyCell: ({row}) => {
            return (
              <span>
                <button class="btn btn-primary btn-sm mr-1" onClick={() => this.openShowOrder(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-eye" viewBox="0 0 16 16">
                        <path
                          d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path
                          d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                &nbsp;
                <button title="Tooltip directive content"
                        class="btn btn-primary btn-sm mr-1"
                        onClick={() => this.downloadInvoice(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-printer" viewBox="0 0 16 16">
                          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                          <path
                            d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                    </svg>
                </button>
              </span>
            )
          }
        }
      ],
      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },
      sortOption: {
        sortChange: (params) => {
          this.sortChange(params);
        },
      },
      checkboxOption: {
        selectedRowKeys: [],

        selectedRowChange: ({row, isSelected}) => {
          this.changeSelectedRowKeys(row, isSelected);
        },

        selectedAllChange: ({isSelected, selectedRowKeys}) => {
          this.changeSelectAll(isSelected, selectedRowKeys);
        },
      },
      eventCustomOption: {
        bodyRowEvents: ({row}) => {
          return {
            dblclick: () => {
              this.openShowOrder(row)
            },
          };
        },
      },

      pageIndex: 1,
      pageSize: 10,
      selectedOrders: [],
    }
  },
  methods: {
    openShowOrder(order) {
      this.$FModal.show(
        {
          component: ShowOrder,
          placement: 'center center',
        },
        {
          order: order
        }
      )
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
    async downloadInvoice(order) {

      window.open(
        this.$config.urlBack + '/api/v1/download-invoice/' + order.orden_id + '/' + order.orden_patient_user_id, "_blank"
      )

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
            this.$emit('updateGetOrders')
            return 0;
          }
        }
      });
    },

    changeSelectedRowKeys(row, isSelected) {
      const rowKey = row.rowKey;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey);
        this.selectedOrders.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedOrders.splice(index, 1);
      }
    },
    resetSelectedRowKeys() {
      this.checkboxOption.selectedRowKeys = [];

      const selectedRowKeysCollection = this.selectedOrders;

      if (selectedRowKeysCollection.length) {
        this.tableData.forEach((item) => {
          if (selectedRowKeysCollection.indexOf(item.rowKey) > -1) {
            this.checkboxOption.selectedRowKeys.push(item.rowKey);
          }
        });
      }
    },
    pageNumberChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.resetSelectedRowKeys();
    },
    // page size change
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    },
    getPlans() {
      this.$axios.get('/api/v1/get-plans').then(resp => {
        this.plans = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Al obtener los planes. Consulte a soporte SaludWom.");
      })
    },
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.orders.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.orders.length;
    },
  },
  watch: {
    dateFilter: function (value) {
      if (!value) {
        this.dateFilter = null

        this.$emit('datefilterNull')
        setTimeout(() => {
          this.$emit('updateGetOrders')
        }, 250)
      }
    },
    valueSearchOrders: function (value) {
      if (!value) {
        this.$emit('updateGetOrders')
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
    this.getPlans()
  }
}
</script>

<style scoped>

</style>
