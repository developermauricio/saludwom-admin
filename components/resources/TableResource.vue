<template>
  <div class="pt-3">
    <div class="card">
      <div class="d-flex justify-content-between">

        <div class="card-header">
          <!--          <h1 class="card-title mb-0 mb-md-0 mb-lg-0">Recursos</h1>-->
        </div>
        <div class="d-md-flex d-lg-flex align-items-center justify-content-end px-2 mt-2">
          <!--=====================================
                FILTRAR TRATAMIENTOS
           ======================================-->
          <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label" for="basicSelect">Filtrar por Tratamiento</label>
            <select class="form-select" v-model="valueTreatment">
              <option value="">Mostrar todos</option>
              <option v-for="(treatment, index) in treatments" :key="treatment.id" :value="treatment.id">
                {{ treatment.treatment }}
              </option>
            </select>
          </div>

          <!--=====================================
                FILTRAR POR CATEGORÍA
           ======================================-->
          <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label" for="basicSelect">Filtrar por categoría</label>
            <select class="form-select" v-model="valueCategory">
              <option value="">Mostrar todos</option>
              <option v-for="(category, index) in categories" :key="category.id" :value="category.id">
                {{ category.category }}
              </option>
            </select>
          </div>

          <!--=====================================
                FILTRAR POR TIPOS DE RECURSOS
           ======================================-->
          <div class="mr-3 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label" for="basicSelect">Filtrar por tipo de recurso</label>
            <select class="form-select" v-model="valueTypeResource">
              <option value="">Mostrar todos</option>
              <option v-for="(type, index) in typesResources" :key="type+index" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!--=====================================
              BUSCAR RECURSOS
          ======================================-->
          <div class="mr-4 mt-1 px-1 m-md-0 m-lg-0 w-50">
            <label class="form-label">Buscar</label>
            <input v-model="valueSearchResource" type="text" class="form-control search-patients"
                   placeholder="Buscar recurso...">
          </div>
        </div>
      </div>

      <div class="card-body">
        <!--=====================================
          TABLA CUESTIONARIOS
        ======================================-->
        <div class="table-responsive" v-if="resources.length > 0">
          <client-only>
            <ve-table
              id="loading-container"
              :scroll-width="200"
              border-y
              :row-style-option="rowStyleOption"
              fixed-header
              :max-height="500"
              row-key-field-name="rowKey"
              :event-custom-option="eventCustomOption"
              :columns="columnsTable"
              :table-data="tableData"/>
            <div class="table-pagination mt-2" v-if="resources.length > 10">
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
        <div v-if="messageIsResources && resources.length === 0">
          <h4 class="text-center">No hay datos para mostrar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewResource from "@/components/resources/PreviewResource.vue";
import AddFormResource from "@/components/resources/AddFormResource.vue";
import {bus} from "@/plugins/bus";

export default {
  name: "TableResource",
  props: ['resources', 'folderId'],
  data() {
    return {
      valueTreatment: null,
      valueCategory: null,
      valueTypeResource: null,
      treatments: [],
      categories: [],
      typesResources: ['Documento', 'Video', 'Imagen'],
      valueSearchResource: '',
      messageIsResources: false,

      rowStyleOption: {
        stripe: true,
        hoverHighlight: true,
      },

      eventCustomOption: {
        bodyRowEvents: ({row, rowIndex}) => {
          return {
            click: (event) => {

            },
          };
        },
      },
      columnsTable: [
        {
          field: "name", key: "name", title: "Nombre del Recurso", center: "left", width: "30%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <a href="#" on-click={() => this.openResource(row)}>
              <div class="mt-2">
                <p class="text-justify">{row.name_file}</p>
              </div>
            </a>
          },
        },
        {
          field: "typeFile", key: "typeFile", title: "Tipo de Recurso", width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <div class="d-flex align-items-center">
              <div class="mt-2">
                <p>{row.type_file}</p>
              </div>
            </div>
          },
        },
        {
          field: "state", key: "state", title: "Estado", width: "10%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            switch (row.state) {
              case '1':
                return <span class="badge bg-success">Activo</span>
              case '2':
                return <span class="badge bg-danger">Inactivo</span>
            }
          },
        },
        {
          field: "created_at", key: "created_at", title: "Fecha de Registro", width: "15%",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return <p>{this.$moment(row.created_at).format('DD MMMM YYYY')}</p>
          },
        },

        {
          field: "",
          key: "e",
          title: "Acciones",
          width: "15%",
          center: "left",
          renderBodyCell: ({row, column, rowIndex}, h) => {
            return (
              <span>
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.openResource(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-eye" viewBox="0 0 16 16">
                        <path
                          d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path
                          d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                    </svg>
                </button>
                &nbsp;
                <button class="btn btn-primary btn-sm mr-1" on-click={() => this.openModalEdit(row)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-pencil" viewBox="0 0 16 16">
                        <path
                          d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>
                &nbsp;
                <button
                  class="btn btn-danger btn-sm mr-1" on-click={() => this.deleteFolderResource(row)}>
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
      pageIndex: 1,
      pageSize: 10,
    }
  },
  methods: {
    search() {
      const searchValue = this.valueSearchResource;

      let exist = []
      if (searchValue) {
        exist = this.resources.filter(
          (x) =>
            !searchValue.length ||
            x.name_file.toLowerCase().includes(searchValue.toLowerCase())
        );
        console.log(exist)
        if (exist.length > 0) {
          this.$emit('searchResource', exist)
        } else {
          this.$toast.error("El recurso no se encuentra registrada.");
        }
      } else {
        this.$emit('updateGetResources')
      }
    },
    openResource(resource) {

      this.$FModal.show(
        {
          component: PreviewResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          resourceFolder: resource
        }
      )
    },

    openModalEdit(resource) {
      this.$FModal.show(
        {
          component: AddFormResource,
          // clickToClose: false,
          // escToClose: false,
          placement: 'center top',
        },
        {
          editResource: true,
          resource: resource,
          folderId: this.folderId
        }
      )
    },

    deleteFolderResource(resource) {

      this.$swal.fire(
        this.swalAlert('¿Esta seguro eliminar el recurso?', 'warning', 'Estoy Seguro', 'Cancelar')
      ).then(async result => {
        if (result.value) {

          this.$vs.loading({
            color: this.$config.colorLoading,
            text: 'Espere por favor...'
          })

          this.$axios.delete(`/api/v1/delete-resource-folder/${resource.resources_folder_content.id}`).then(resp => {
            if (resp.data.success) {
              this.$toast.success("El recurso se eliminó exitosamente.");
              bus.$emit('updateGetResources')
            } else {
              this.$toast.error('No se puede eliminar porque hay uno o varios recursos asignados a un objetivo. Consulte con soporte SaludWom.')
            }

          }).catch(e => {
            console.log(e)
            this.$toast.error('Error al eliminar el recurso. Consulte con soporte SaludWom.')
          }).finally(() => {
            this.$vs.loading.close()
          })
        }
      })
    },

    getCategories() {
      this.$axios.get('api/v1/get-categoires-resource-folder-content').then(resp => {
        this.categories = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las categorías. Consulte a soporte SaludWom.");
      })
    },

    getTreatments() {
      this.$axios.get('api/v1/get-treatments-actives').then(resp => {
        this.treatments = resp.data.data
      }).catch(e => {
        console.log(e)
        this.$toast.error("Error al obtener las especialidades. Consulte a soporte SaludWom.");
      })
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

    /*=============================================
    FUNCIÓN PARA LAS OPCIONES DE LA ALERTA DE CONFIRMACIÓN
   =============================================*/
    swalAlert(message, icon, textAccept, textCancel) {
      return {
        title: message,
        icon: icon,
        confirmButtonText: textAccept,
        cancelButtonText: textCancel,
        customClass: {
          confirmButton: 'btn btn-primary mx-1',
          cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: false,
        showCancelButton: true,
        reverseButtons: true,
        allowOutsideClick: false,
      }
    },
  },
  computed: {
    // table data
    tableData() {
      const {pageIndex, pageSize} = this;

      if (this.valueSearchResource || this.valueTreatment || this.valueCategory || this.valueTypeResource) {
        let filteredResources = this.resources;

        if (this.valueSearchResource) {
          filteredResources = filteredResources.filter(resource =>
            resource.name_file.toLowerCase().includes(this.valueSearchResource.toLowerCase())
          );
        }

        if (this.valueTreatment) {
          filteredResources = filteredResources.filter(resource =>
            resource.resources_folder_content.treatments.some(treatment =>
              treatment.id === this.valueTreatment
            )
          );
        }

        if (this.valueCategory) {
          filteredResources = filteredResources.filter(resource =>
            resource.resources_folder_content.categories.some(category =>
              category.id === this.valueCategory
            )
          );
        }

        if (this.valueTypeResource) {
          const fileTypes = {
            video: ['mp4', 'mov', 'iframe'],
            documento: ['docx', 'pdf', 'xlsx'],
            imagen: ['png', 'jpg']
          };

          const selectedFileTypes = fileTypes[this.valueTypeResource.toLowerCase()];

          filteredResources = filteredResources.filter(resource =>
            selectedFileTypes.includes(resource.type_file)
          );
        }

        return filteredResources.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
      }

      return this.resources.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    },
    // total count
    totalCount() {
      return this.resources.length;
    },
  },
  mounted() {
    this.getTreatments()
    this.getCategories()
  }
}
</script>
<style scoped>

</style>
