<template>
  <div>
    <div class="card">
      <div class="d-md-flex d-lg-flex align-items-center justify-content-between pt-1 px-1">
        <div class="card-header">
          <div>
            <h4 class="card-title  mb-md-0 mb-lg-0">Lista de Planes</h4>
          </div>
        </div>
        <!--=====================================
         BUSCAR PACIENTE
       ======================================-->
        <div class="mr-4 mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label">Buscar</label>
          <input v-model="valueSearchPlans" v-on:keyup.enter="search" type="text"
                 class="form-control search-patients w-100" placeholder="Buscar...">
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
          TABLA DOCTORES
        ======================================-->
        <div class="table-responsive" v-if="plans.length > 0 && !messageIsPlans">
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
            <div class="table-pagination mt-2" v-if="plans.length > 10">
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
        <div v-if="messageIsPlans && plans.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Resources from "@/components/valoration/Resources.vue";
import EditPlan from "@/components/admin/plans/EditPlan.vue";
import {bus} from "@/plugins/bus";
import ShowSpecialty from "@/components/admin/specialities/ShowSpecialty.vue";
import ShowPlan from "@/components/admin/plans/ShowPlan.vue";

export default {
  name: "TablePlans",
  components: {Resources},
  props: ['plans', 'messageIsPlans'],
  data() {
    return {
      valueSearchPlans: String(),

      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },

      columnsTable: [
        {
          // type: "checkbox",
          field: "sequence_number",
          key: "sequence_number",
          title: "#",
          width: "1%",
          align: "left",
        },
        {
          field: "name", key: "name", title: "Nombre Plan", align: "left", width: "1%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href="#" on-click={() => this.openShowPlan(row)}>
              <div class="d-flex align-items-center">
                <div class="mt-2">
                  <p>{row.name}</p>
                </div>
              </div>
            </a>
          },
        },
        {
          field: "price", key: "price", title: "Precio", align: "left", width: "1%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (row.price).toFixed(2) + '€'
          }
        },
        {
          field: "period", key: "period", title: "Periodo", align: "left", width: "1%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.period) {
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
          field: "state", key: "state", title: "Estado", align: "center", width: "1%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            let currentStatus = row.state === '1'
            return h('vs-switch', {
              props: {
                color: 'success',
                value: currentStatus// Asigna el valor de `status` al componente
              },
              on: {
                input: () => {
                  this.changeStatusSwitch(row)
                }
              }
            });
          },
        },
        {field: "update_at_format", key: "update_at_format", title: "Última Actualización", align: "left", width: '2%'},
        {
          field: "",
          key: "e",
          title: "Acciones",
          width: "2%",
          center: "left",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (
              <span>
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.openShowPlan(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-eye" viewBox="0 0 16 16">
                        <path
                          d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path
                          d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                &nbsp;
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.editPlan(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-pencil" viewBox="0 0 16 16">
                        <path
                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>
                &nbsp;
                <button
                  class="btn btn-danger btn-sm mr-1" on-click={() => this.deletePlan(row)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
                       viewBox="0 0 16 16"><path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                  </svg>
                </button>
              </span>
            )
          }
        }
      ],

      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            dblclick: (event) => {

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

          this.sortChange(params);
        },
      },

      pageIndex: 1,
      pageSize: 10,
      /*Data information*/
      checked: [],

      selectedPlans: [],
    }
  },
  methods: {
    openShowPlan(plan) {
      this.$FModal.show(
        {
          component: ShowPlan,
          placement: 'center center',
        },
        {
          plan: plan
        }
      )
    },
    editPlan(plan) {
      this.$FModal.show(
        {
          component: EditPlan,
          placement: 'center center',
        },
        {
          plan: plan
        }
      )
    },
    deletePlan(plan) {

      this.$swal.fire(
        {
          title: `¿Esta seguro de eliminar el plan <strong>${plan.name}</strong>?`,
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

          this.$axios.delete(`/api/v1/delete-plan/${plan.id}`).then(resp => {
            if (resp.data.success) {
              this.$toast.success("El plan se eliminó exitosamente.");
              bus.$emit('updateTableListPlans')
            } else {
              this.$toast.error('No se puede eliminar porque hay uno o varios paciente suscritos a este plan. Consulte con soporte SaludWom.')
            }

          }).catch(e => {
            console.log(e)
            this.$toast.error('Error al eliminar el plan. Consulte con soporte SaludWom.')
          }).finally(() => {
            this.$vs.loading.close()
          })
        }
      })

    },
    async changeStatusSwitch(plan) {

      const item = this.plans.find(item => item.id === plan.id);

      if (item) {
        try {
          const response = await this.$axios.post(`api/v1/plan-update-status/${plan.id}`);
          this.$toast.success('El estado se actualizó correctamente')
        } catch (error) {
          console.log(error);
          return this.$toast.error("Error al actualizar el estado. Consulte a soporte SaludWom");
        }

        let newStatus = item.state === '1' ? '2' : '1'

        return item.state = newStatus;
      }
    },
    search() {
      const searchValue = this.valueSearchPlans;
      let exist = []
      if (searchValue) {
        exist = this.doctors.filter(
          (x) =>
            !searchValue.length ||
            x.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(exist)
        if (exist.length > 0) {
          this.$emit('searchPlans', exist)
        } else {
          this.$toast.error("El plan no se encuentra registrado.");
        }
      } else {
        this.$emit('updateTablePlan')
      }
    },

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

    changeSelectAll(isSelected, selectedRowKeys) {
      this.selectedPlans = []
      this.checkboxOption.selectedRowKeys = selectedRowKeys;

      if (isSelected) {
        this.selectedPlans =
          this.selectedPlans.concat(selectedRowKeys);
      } else {
        this.tableData.forEach((item) => {
          const index = this.selectedPlans.indexOf(item.id)

          if (index > -1) {
            this.selectedPlans.splice(index, 1);
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
  watch: {
    valueSearchPlans: function (value) {
      if (!value) {
        this.$emit('updateTablePlan')
      }
    },
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.plans.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.plans.length;
    },
  },
}
</script>


<style scoped>

</style>
