<template>
  <div>
    <div class="card">
      <div class="d-md-flex d-lg-flex align-items-center justify-content-between pt-1 px-1">
        <div class="card-header">
          <div>
            <h4 class="card-title  mb-md-0 mb-lg-0">Lista de Especialidades</h4>
          </div>
        </div>
        <!--=====================================
         BUSCAR PACIENTE
       ======================================-->
        <div class="mr-4 mt-1 px-1 m-md-0 m-lg-0">
          <label class="form-label">Buscar</label>
          <input v-model="valueSearchSpecialities" v-on:keyup.enter="search" type="text"
                 class="form-control search-patients" placeholder="Buscar..." style="width: 20rem">
        </div>
      </div>
      <div class="card-body">
        <!--=====================================
          TABLA ESPECIALIDADES
        ======================================-->

        <div class="table-responsive" v-if="specialities.length > 0 && !messageIsSpecialities">
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
            <div class="table-pagination mt-2" v-if="specialities.length > 10">
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
        <div v-if="messageIsSpecialities && specialities.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShowDoctor from "@/components/admin/doctors/ShowDoctor.vue";
import ShowSpecialty from "@/components/admin/specialities/ShowSpecialty.vue";
import EditSpecialty from "@/components/admin/specialities/EditSpecialty.vue";

export default {
  name: "TableSpecialities",
  props: ['specialities', 'messageIsSpecialities'],
  data() {
    return {
      valueSearchSpecialities: String(),

      columnsTable: [
        {
          // type: "checkbox",
          field: "sequence_number",
          key: "sequence_number",
          title: "#",
          align: "left",
          width: "1%"
        },
        {
          field: "treatment", key: "treatment", title: "Especialidad", align: "left", width: "5%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href="#" on-click={() => this.openShowSpecialities(row)}>
              <div class="d-flex align-items-center">
                <div class="mt-2">
                  <p>{row.treatment}</p>
                </div>
              </div>
            </a>
          },
        },
        {
          field: "state", key: "state", title: "Estado", align: "center", width: "2%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            if (row.state == '1') {
              return <span class="badge bg-success">Activo</span>
            }

            if (row.state == '2') {
              return <span class="badge bg-danger">Inactivo</span>
            }
          },
        },
        {
          field: "categories", key: "categories", title: "Categorías", width: "3%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return row.categories.map((item) => {
              return <span class="badge bg-primary ml-1 mt-1">{item.name}</span>
            })
          },
        },
        {
          field: "",
          key: "e",
          title: "Acciones",
          width: "4%",
          center: "left",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (
              <span>
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.openShowSpecialities(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-eye" viewBox="0 0 16 16">
                        <path
                          d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path
                          d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                &nbsp;
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.editSpecialty(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-pencil" viewBox="0 0 16 16">
                        <path
                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>
                &nbsp;
                <button
                  class="btn btn-danger btn-sm mr-1" on-click={() => this.deleteSpecialty(row)}>
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
              this.openShowSpecialities(row)
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
      selectedSpecialities: [],
    }
  },
  methods: {
    deleteSpecialty(specialty) {

      this.$swal.fire(
        {
          title: `¿Esta seguro de eliminar la especialidad <strong>${specialty.treatment}</strong>?`,
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

          this.$axios.delete(`/api/v1/delete-treatment/${specialty.id}`).then(resp =>{
            if (resp.data.success){
              this.$toast.success("La especialidad se eliminó exitosamente.");
              this.$emit('updateTableSpecialities')
            }else{
              this.$toast.error('No se puede eliminar la especialidad porque hay uno o varios especialistas y objetivos relacionados. Consulte con soporte SaludWom.')
            }

          }).catch(e =>{
            console.log(e)
            this.$toast.error('Error al eliminar la especialidad. Consulte con soporte SaludWom.')
          }).finally(() =>{ this.$vs.loading.close() })
        }
      })

    },
    editSpecialty(specialty) {
      this.$FModal.show(
        {
          component: EditSpecialty,
          placement: 'center center',
        },
        {
          specialty: specialty
        }
      )
    },
    search() {
      const searchValue = this.valueSearchSpecialities;
      let exist = []
      if (searchValue) {
        exist = this.specialities.filter(
          (x) =>
            !searchValue.length ||
            x.treatment.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(exist)
        if (exist.length > 0) {
          this.$emit('searchSpecialities', exist)
        } else {
          this.$toast.error("La especialidad no se encuentra registrada.");
        }
      } else {
        this.$emit('updateTableSpecialities')
      }
    },

    openShowSpecialities(specialty) {
      this.$FModal.show(
        {
          component: ShowSpecialty,
          placement: 'center center',
        },
        {
          specialty: specialty
        }
      )
    },

    changeSelectedRowKeys(row, isSelected) {
      const rowKey = row.rowKey;

      if (isSelected) {
        this.checkboxOption.selectedRowKeys.push(rowKey);
        this.selectedSpecialities.push(rowKey);
      } else {
        const index = this.checkboxOption.selectedRowKeys.indexOf(rowKey);
        this.checkboxOption.selectedRowKeys.splice(index, 1);
        this.selectedSpecialities.splice(index, 1);
      }
    },

    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    },

    pageNumberChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.resetSelectedRowKeys();
    },

    resetSelectedRowKeys() {
      this.checkboxOption.selectedRowKeys = [];

      const selectedRowKeysCollection = this.selectedSpecialities;

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
    valueSearchSpecialities: function (value) {
      if (!value) {
        this.$emit('updateTableSpecialities')
      }
    },
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;
      return this.specialities.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.specialities.length;
    },
  },
}
</script>

<style scoped>

</style>
