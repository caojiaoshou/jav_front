<template>
  <v-app class="overflow-hidden">
    <v-app-bar class="position-fixed">
      <template #prepend>
        <v-app-bar-nav-icon
          class="ma-2"
          @click="drawerModel=!drawerModel"
        />
      </template>
      <template #default>
        <v-spacer />
        <v-text-field
          v-model="localModel"
          variant="underlined"
          class="ma-2"
          label="全局搜索"
          clearable
          hide-details
          max-width="300px"
          prepend-inner-icon="mdi-magnify"
        />
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawerModel"
      class="position-fixed"
    >
      <template v-for="item in pageConfig">
        <v-list-item
          v-if="!!item.url"
          :key="item.url"
          class="pl-8"
          link
          :to="item.url"
          lines="two"
          :title="item.text"
        />
        <v-list-item
          v-else
          :key="item.text"
          :subtitle="item.text"
          type="subheader"
          class="border-t"
          lines="two"
        />
      </template>

      <template #append>
        <v-text-field
          v-model="pwdModel"
          variant="solo-inverted"
          label="应用密码"
          :type="showPwdModel?'':'password'"
          class="my-4 mx-2"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPwdModel?'mdi-eye-off-outline':'mdi-eye-outline'"
          @click:append-inner="showPwdModel =!showPwdModel"
        />
      </template>
    </v-navigation-drawer>
    <v-main class="my-1">
      <router-view />
    </v-main>

    <v-snackbar
      v-model="snackbarModel"
      :color="snackbar.class"
      :timeout="-1"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.close"
        >
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useDisplay} from "vuetify";
import {useGlobalFilter, useGlobalPwd, useSnackbar} from "@/stores/app.js";

const display = useDisplay()
const drawerModel = ref(!display.mobile.value)
const pageConfig = [
  {'text': '页面'},
  {'text': '全部视频', 'url': '/'},
  {'text': '历史'},
]
const snackbar = useSnackbar()
const snackbarModel = computed(
  {
    get() {
      return snackbar.show
    },
    set(value) {
      snackbar.setShow(value)
    }
  }
)

const showPwdModel = ref(false)
const globalPwd = useGlobalPwd()
const pwdModel = computed(
  {
    get() {
      return globalPwd.pwdValue
    },
    set(value) {
      globalPwd.update(value)
    }
  }
)


const globalFilter = useGlobalFilter()
const localModel = computed({
  get() {
    return globalFilter.textValue
  },
  set(value) {
    return globalFilter.update(value)
  }
})


</script>
