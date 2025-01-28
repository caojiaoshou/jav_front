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

      <template #append>
        <v-chip
          label
          small
          :text="previewCount.toLocaleString()"
          prepend-icon="mdi-video-outline"
          class="mr-1"
        />
        <v-chip
          label
          small
          :text="srtCount.toLocaleString()"
          prepend-icon="mdi-subtitles-outline"
          class="mx-1"
        />
        <v-chip
          label
          small
          :text="videoHours.toLocaleString()"
          prepend-icon="mdi-clock-outline"
          class="ml-1"
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
          class="pl-8  text-wrap"
          link
          :to="item.url"
          lines="one"
          :title="item.text"
        />
        <v-list-item
          v-else
          :key="item.text"
          :subtitle="item.text"
          type="subheader"
          class="border-t"
          lines="one"
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
      <router-view/>
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
import {computed, onMounted, ref} from 'vue'
import {useGlobalFilter, useGlobalPwd, useLocalHistory, useSnackbar} from "@/stores/app.js";
import axios from "axios";


const drawerModel = ref(false)

const pageConfigStatic = [
  {'text': '页面'},
  {'text': '全部视频', 'url': '/'},
  {'text': '历史'},
]

const localHistory = useLocalHistory()
const pageConfig = computed(() => {
  const res = [...pageConfigStatic]

  localHistory.groupedHistory.slice(0, 20).forEach(item => {
    res.push({text: item.videoName, url: '/video/' + item.videoPid})
  })

  return res
})

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

const previewCount = ref(0)
const srtCount = ref(0)
const videoCount = ref(0)
const videoHours = ref(0.0)
const fetchSummary = async () => {
  const response = await axios.post('/api/summary')
  previewCount.value = response.data.preview_count
  srtCount.value = response.data.srt_count
  videoCount.value = response.data.video_count
  videoHours.value = Math.round(response.data.total_duration_hour)
}
onMounted(fetchSummary)
</script>
