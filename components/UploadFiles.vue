<template>
  <div>

    <VueFileAgent
      ref="vueFileAgent"
      :theme="theme"
      :multiple="multiple"
      :deletable="true"
      :meta="true"
      :accept="accept"
      :maxSize="maxSize"
      :maxFiles="maxFiles"
      :helpText="helpText"
      :errorText="errorText"
      v-model="fileRecords"
      @select="filesSelected($event)"
      @beforedelete="onBeforeDelete($event)"
      @delete="fileDeleted($event)"
    ></VueFileAgent>
    <!--  <div class="mt-3">-->
    <!--    <button class="btn btn-primary" @click="uploadFiles()">Enviar</button>-->
    <!--  </div>-->
  </div>
</template>

<script>
import {bus} from "../plugins/bus";

export default {
  name: "UploadFiles",
  data() {
    return {
      fileRecords: [],
      uploadHeaders: '',
      error: false,
      // uploadUrl: ``,
      fileRecordsForUpload: []
    }
  },
  props: ['uploadUrl', 'theme', 'multiple', 'accept', 'maxSize', 'maxFiles', 'helpText', 'errorText'],
  methods: {
    uploadFiles: function () {
      if (this.fileRecordsForUpload.length > 0) {
        this.$vs.loading({
          color: process.env.COLOR_BASE,
          text: `Subiendo ${this.fileRecordsForUpload.length > 1 ? 'archivos' : 'el archivo'}. Espere por favor...`
        })
        this.$refs.vueFileAgent.upload(this.uploadUrl, this.uploadHeaders, this.fileRecordsForUpload).then(resp => {
          this.$vs.loading.close()
          bus.$emit('updateDataValuation')
          bus.$emit('closeAlert')
          this.$FModal.hide()
          this.$toast.success({
            title: 'Confirmación',
            message: 'La carga de uno o mas archivos fue exitoso!',
            showDuration: 1000,
            hideDuration: 5000,
          })
        }).catch(e => {
          console.log(e)
          this.$toast.error({
            title: 'Error',
            message: 'Error al subir archivos. Consulte a soporte SaludWom.',
            showDuration: 1000,
            hideDuration: 8000,
          })
          this.$vs.loading.close()
        });
        this.$vs.loading.close()
        // this.$refs.vueFileAgent.upload
        this.fileRecordsForUpload = [];
      }

    },
    deleteUploadedFile: function (fileRecord) {
      // Using the default uploader. You may use another uploader instead.
      this.$refs.vueFileAgent.deleteUpload(this.uploadUrl, this.uploadHeaders, fileRecord);
    },
    filesSelected: function (fileRecordsNewlySelected) {
      let validFileRecords = fileRecordsNewlySelected.filter((fileRecord) => !fileRecord.error);
      console.log(validFileRecords.length)
      if (validFileRecords.length > 0) {
        this.fileRecordsForUpload = this.fileRecordsForUpload.concat(validFileRecords);
      } else {
        this.error = true
      }

    },
    onBeforeDelete: function (fileRecord) {
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      let k = this.fileRecords.indexOf(fileRecord);
      if (i !== -1) {
        this.$emit('clearData')
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1);

        if (k !== -1) this.fileRecords.splice(k, 1);
      } else {

        // this.$confirm(
        //   {
        //     message: '¿Estas seguro de quitar este archivo?',
        //     button: {
        //       no: 'No',
        //       yes: 'Si'
        //     },
        //     /**
        //      * Callback Function
        //      * @param {Boolean} confirm
        //      */
        //     callback: async confirm => {
        //       if (confirm) {
        //         this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
        //       }
        //     }
        //   })
        // if (confirm('Are you sure you want to delete?')) {
        this.fileRecords.splice(k, 1);
        this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
        // }
      }
    },
    fileDeleted: function (fileRecord) {
      this.error = false
      let i = this.fileRecordsForUpload.indexOf(fileRecord);
      if (i !== -1) {
        this.fileRecordsForUpload.splice(i, 1);
      } else {
        this.deleteUploadedFile(fileRecord);
      }
    },
    validateUpload(countArchives) {
      let totalArchives = this.numberArchives - countArchives
      console.log(this.fileRecordsForUpload.length)
      console.log(totalArchives)
      if (this.fileRecordsForUpload.length > totalArchives) {
        this.$toast.error({
          title: 'Error',
          message: `No puedes subir mas de ${totalArchives === 0 ? 10 : totalArchives} archivos.`,
          showDuration: 800,
          hideDuration: 3000,
        })
      }
      if (this.fileRecordsForUpload.length <= totalArchives) {
        if (this.fileRecordsForUpload.length < 1) {
          this.$toast.error({
            title: 'Error',
            message: 'Agrega al menos un archivo.',
            showDuration: 800,
            hideDuration: 3000,
          })
        } else {
          this.$confirm(
            {
              message: `¿Esta segur@ de agregar ${this.fileRecordsForUpload.length > 1 ? 'los archivos.?' : 'el archivo.?'}`,
              button: {
                no: 'No',
                yes: 'Si'
              },
              /**
               * Callback Function
               * @param {Boolean} confirm
               */
              callback: async confirm => {
                if (confirm) {
                  setTimeout(() => {
                    this.uploadFiles()
                  }, 500)
                }
              }
            })
        }
      }
    }
  },
  mounted() {
    setTimeout(() => {
      bus.$on('saveFiles', () => {
        this.uploadFiles()
      }, 500)
    })
  },
  watch: {
    fileRecords: {
      handler(val) {
        setTimeout(() => {
          if (!this.error) {
          this.$emit('fileRecords', val)
          }
        }, 200)
      },
      deep: true
    },
  }
}
</script>

<style scoped>

</style>
