<script setup>
import axios from 'axios'
import {computed, ref} from 'vue'
import {useDate, useDisplay} from "vuetify";
import {formatTime} from "@/utils/subtitle.js";

const enumNotStarted = 0
const enumOfFinished = 2

const videoArray = ref([])
const pageLoading = ref(false)
const fetchDB = async (loading = true) => {
  if (loading) {
    pageLoading.value = true
  }
  try {
    const {data} = await axios.post('/api/list-video')
    videoArray.value = data
  } finally {
    if (loading) {
      pageLoading.value = false
    }
  }
}

const archiveDB = async () => {
  pageLoading.value = true
  try {
    const {data} = await axios.post('/api/archive-video')
    videoArray.value = data
  } finally {
    pageLoading.value = false
  }
}

const noPreviewOnly = ref(false)
const noSrtOnly = ref(false)

const cols = [
  {
    key: 'video_name',
    title: '视频名称',
    align: 'start',
    sortable: true,
    maxWidth: '20rem',
  },
  {
    key: 'video_archive_at',
    title: '归档时间',
    align: 'end',
    sortable: true,
  },
  {
    key: 'video_crate_at',
    title: '文件时间',
    align: 'end',
    sortable: true
  },
  {
    key: 'video_duration',
    title: '时长',
    align: 'end',
    sortable: true,
  },
  {
    key: 'preview_state',
    title: '预览状态',
    align: 'end',
    sortable: true,
  },
  {
    key: 'srt_state',
    title: '字幕状态',
    align: 'end',
    sortable: true,
  }
]

const rows = computed(() => {
  return videoArray.value.filter(item => {
    if (noPreviewOnly.value && item.preview_state === enumOfFinished) {
      return false
    }
    if (noSrtOnly.value && item.srt_state === enumOfFinished) {
      return false
    }
    return true
  })
})


const videoTableMark = ref(null)
const display = useDisplay()
const tableHeight = computed(() => {
  if (videoTableMark.value) {
    return display.height.value - videoTableMark.value.getBoundingClientRect().y
  } else {
    return 0
  }
})

const dateFunc = useDate()
const formatDatetime = (datetime) => {
  return dateFunc.format(datetime, 'keyboardDateTime')
}

const createSrt = async (item) => {
  pageLoading.value = true
  try {
    await axios.post('/api/create-srt', item.video_pid)
    await fetchDB(false)
  } finally {
    pageLoading.value = false
  }
}

const createPreview = async (item) => {
  pageLoading.value = true
  try {
    await axios.post('/api/create-preview', item.video_pid)
    await fetchDB(false)
  } finally {
    pageLoading.value = false
  }
}
</script>

<template>
  <v-banner>
    <v-btn
      text="读取数据库"
      color="success"
      :disabled="pageLoading"
      class="mx-2"
      @click="fetchDB"
    />
    <v-btn
      text="归档视频"
      color="warning"
      :disabled="pageLoading"
      class="mx-2"
      @click="archiveDB"
    />
    <v-switch
      v-model="noPreviewOnly"
      label="仅无预览"
      color="primary"
      class="mx-2"
      :disabled="pageLoading"
      hide-details
    />
    <v-switch
      v-model="noSrtOnly"
      label="仅无字幕"
      color="primary"
      class="mx-2"
      :disabled="pageLoading"
      hide-details
    />
  </v-banner>

  <v-progress-linear
    v-if="pageLoading"
    color="primary"
    indeterminate
  />

  <div ref="videoTableMark" />

  <v-data-table-virtual
    :headers="cols"
    :items="rows"
    :loading="pageLoading"
    :height="tableHeight"
    fixed-header
    color="primary"
  >
    <template #item.video_archive_at="{item}">
      {{ formatDatetime(item.video_archive_at) }}
    </template>
    <template #item.video_crate_at="{item}">
      {{ formatDatetime(item.video_create_at) }}
    </template>
    <template #item.video_duration="{item}">
      {{ formatTime(item.video_duration, false) }}
    </template>
    <template #item.preview_state="{item}">
      <template v-if="item.preview_state === enumOfFinished">
        {{ item.preview_state }}
      </template>
      <template v-else>
        <v-btn
          :text="item.preview_state.toString()"
          :disabled="pageLoading"
          variant="outlined"
          :color="item.preview_state===enumNotStarted?'warning':'error'"
          @click="createPreview(item)"
        />
      </template>
    </template>
    <template #item.srt_state="{item}">
      <template v-if="item.srt_state === enumOfFinished">
        {{ item.srt_state }}
      </template>
      <template v-else>
        <v-btn
          :text="item.srt_state.toString()"
          :disabled="pageLoading"
          variant="outlined"
          :color="item.srt_state===enumNotStarted?'warning':'error'"
          @click="createSrt(item)"
        />
      </template>
    </template>
  </v-data-table-virtual>
</template>

<style scoped>

</style>
