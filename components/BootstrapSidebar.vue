<template>
    <div>
      <div>
        <!-- Sidebar -->
        <nav
          id="sidebar"
          class="vue-bootstrap-sidebar default-theme"
          :class="[ theme ] && [ show ? 'sidebar-visible' : 'sidebar-hidden' ]"
        >
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="sidebar-header"
            v-html="header"
          />
          <!-- eslint-enable -->
          <b-list-group class="items-wrapper px-1">
            <template v-for="(link, index) in links">
              <template v-if="link.href !== undefined">
                <b-list-group-item :key="index">
                  <b-button
                    block
                    :to="link.href"
                    variant="none"
                    class="btn sidebar-menu-item"
                    :squared="true"
                  >
                    <div class="d-inline-block align-items-center mr-2" v-html="$feathericons[link.icon].toSvg()"></div>
                    <div class="link-name">
                      {{ link.name }}
                    </div>
                  </b-button>
                </b-list-group-item>
              </template>
              <template v-else>
                <b-list-group-item
                  :key="index"
                >
                  <b-button
                    v-b-toggle="`accordion-${link.name}`"
                    block
                    href="#"
                    variant="none"
                    class="sidebar-menu-item dropdown-toggle"
                  >
                    <div class="d-inline-block align-items-center mr-2" v-html="$feathericons[link.icon].toSvg()"></div>
                    <div class="link-name">
                      {{ link.name }}
                    </div>
                  </b-button>
                </b-list-group-item>
                <b-collapse
                  :id="`accordion-${link.name}`"
                  :key="index + 10"
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-list-group>
                    <b-list-group-item
                      v-for="(child, idx) in link.children"
                      :key="idx"
                    >
                      <b-button
                        block
                        variant="none"
                        class="sidebar-menu-item child-level-1"
                        :to="child.href"
                      >
                        <div class="d-inline-block" v-html="$feathericons[child.icon].toSvg()"></div>
                        <div class="link-name">
                          {{ child.name }}
                        </div>
                      </b-button>
                    </b-list-group-item>
                  </b-list-group>
                </b-collapse>
              </template>
            </template>
          </b-list-group> <!--/ .items-wrapper -->
        </nav>
        <div
          id="navbar"
          :class="[ show ? 'sidebar' : 'no-sidebar' ]"
        >
          <slot name="navbar" />
        </div>
        <!-- Hamburger Menu -->
        <div
          id="content"
          :class="[ show ? 'sidebar' : 'no-sidebar' ]"
        >
          <slot name="content" />
        </div>
      </div>
    </div>

</template>

<script>
export default {
  name: "BootstrapSidebar",
  props: {
    links: {
      type: Array,
      default: null
    },
    initialShow: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'default-theme'
    },
    header: {
      type: String,
      default: 'Sidebar'
    }
  },
  data() {
    return {
      show: this.initialShow

    }
  }
}
</script>

<style scoped>

</style>
