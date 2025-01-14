<template>
    <div>
      <!--=====================================
          TABLA SUBSCRIPTIONS
      ======================================-->
      <div class="table-responsive" v-if="subscriptions.length > 0 && !messageIsSubscriptions">
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
          <div class="table-pagination mt-2" v-if="subscriptions.length > 10">
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
  name: "TableListSubscriptionsPatient",
  props:['subscriptions', 'messageIsSubscriptions'],
  data() {
    return {
      plans: [],
      valueSearchSubscriptions: String(),
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
          field: "sequence_number",
          key: "index",
          title: "#",
          width: "3%",
          align: "center",
        },
        {
          field: "subscription_plan_name", key: "subscription_plan_name", title: "Plan", align: "left", width: "6%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="mt-1 d-flex align-items-center">
              <p>{row.plan.name}</p>
              <p class="text-primary"> {row.name ? ' - '+ row.name : ''}</p>
            </div>
          }
        },
        {
          field: "subscription_state", key: "subscription_state", title: "Estado", align: "center", width: "7%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.state) {
              case '1':
                return <span class="badge bg-warning">Pendiente</span>
              case '2':
                return <span class="badge bg-danger">Cancelado</span>
              case '3':
                return <span class="badge bg-danger">Rechazado</span>
              case '4':
                return <span class="badge bg-success">Aceptado</span>
              case '5':
                return <span class="badge bg-info">Completado</span>
            }
          },
        },
        {
          field: "price", key: "price", title: "Precio", align: "left", width: "6%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (row.plan.price).toFixed(2) + '€'
          }
        },
        {
          field: "subscription_period", key: "subscription_period", title: "Período", align: "left", width: "5%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.plan.period) {
              case 'week':
                return 'Semana'
              case 'month':
                return 'Més'
              case 'year':
                return 'Año'
                break;
            }
          },
        },
        {
          field: "subscription_created_at",
          key: "subscription_created_at",
          title: "Fecha Registro",
          align: "left",
          width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return this.$moment(row.created_at).format('DD MMMM YYYY')
          },
        },

        {
          field: "",
          key: "e",
          title: "Acciones",
          width: "5%",
          center: "left",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (
              <span>
                <button title="Tooltip directive content"
                        class="btn btn-primary btn-sm mr-1"
                        disabled={!row.order}
                        on-click={() => this.downloadInvoice(row)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                          <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                          <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
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

        selectedRowChange: ({row, isSelected, selectedRowKeys}) => {
          this.changeSelectedRowKeys(row, isSelected);
        },

        selectedAllChange: ({isSelected, selectedRowKeys}) => {
          this.changeSelectAll(isSelected, selectedRowKeys);
        },
      },
      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            dblclick: (event) => {
              this.showSubscriptions(row)
            },
          };
        },
      },

      pageIndex: 1,
      pageSize: 10,
      selectedSubscriptions: [],
    }
  },

  methods: {
    async downloadInvoice(subscription) {

      window.open(
        this.$config.urlBack + '/api/v1/download-invoice/' + subscription.order.id + '/' + subscription.patient.user.id, "_blank"
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
            this.$emit('updateGetSubscriptions')
            return 0;
          }
        }
      });
    },
    changeSelectedRowKeys(row, isSelected) {
      const rowKey = row.rowKey;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey);
        this.selectedSubscriptions.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedSubscriptions.splice(index, 1);
      }
    },


    search() {
      const searchValue = this.valueSearchSubscriptions;
      console.log(searchValue)
      let exist = []
      if (searchValue) {
        exist = this.subscriptions.filter(
          (x) =>
            !searchValue.length ||
            x.subscription_plan_name.toLowerCase().includes(searchValue.toLowerCase()) || x.subscription_patient_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(exist)
        if (exist.length > 0) {
          this.$emit('searchSubscriptions', exist)
        } else {
          this.$toast.error("La suscripción no se encuentra registrada.");
        }
      } else {
        this.$emit('updateGetSubscriptions')
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
    resetSelectedRowKeys() {
      this.checkboxOption.selectedRowKeys = [];

      const selectedRowKeysCollection = this.selectedSubscriptions;

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
      return this.subscriptions.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.subscriptions.length;
    },
  },
}

</script>

<style scoped>

</style>
