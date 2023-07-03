<template>
  <div>
    <div v-if="resources.length === 0">
      <h5 class="text-muted mt-2 text-center">No hay recursos asignados</h5>
    </div>
    <div class="card cursor-pointer" v-for="(resource, index) in resources" :key="index">
      <vs-collapse accordion>
        <vs-collapse-item>
          <div slot="header" class="card-body">
            <div>
              <h2 class="m-0">{{ resource.created_at_format }}</h2>
              <span :class="`mr-5 mt-1 badge bg-${ resource.state === '1' ? 'warning':'success'}`"
                    style="font-size: 1rem">{{ resource.state === '1' ? 'Pendiente' : 'Resuelto' }}</span>
            </div>
          </div>
          <div>
            <PreviewResourceTab :resource="resource"/>
          </div>
        </vs-collapse-item>
      </vs-collapse>
    </div>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
export default {
  name: "Resources",
  props: ['valuation'],
  computed: {
    resources() {
      return cloneDeep(this.$store.getters['listResources'])
    }
  },
  async beforeMount() {
    await this.$store.dispatch('getResource', this.valuation.id)
  },
}
</script>

<style scoped>

</style>
