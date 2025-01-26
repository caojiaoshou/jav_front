<template>
  <v-row no-gutters>
    <v-col
      v-for="(previewItem,previewIndex) in filteredPreviews"
      :key="previewItem.video_pid"
      cols="6"
      md="4"
      lg="3"
      class="pa-1"
    >
      <preview
        :face-pid="previewItem.face_pid"
        :quick-look-pid="previewItem.quick_look_pid"
        :video-name="previewItem.name"
        :age="previewItem.age"
        :duration="previewItem.duration"
        :srt-ready="previewItem.srt_ready"
        :create-at="previewItem.create_at"
        @click-major="onPreviewClicked(previewItem.video_pid)"
      />
      <div
        v-if="previewIndex >= previewArray.length-3"
        v-intersect="onIntersect"
      />
    </v-col>
  </v-row>
  <div v-intersect="onIntersect" />
</template>

<script setup>
import Preview from "@/components/Preview.vue";
import {onMounted, ref, watch} from 'vue'
import axios from "axios";
import {useRouter} from 'vue-router'
import {useGlobalFilter} from "@/stores/app.js";

const globalFilter = useGlobalFilter()

const previewArray = ref([])
const loadBatchSize = ref(20)
const pageLoading = ref(false)
const exhaustedMark = ref(false)
watch(
  () => globalFilter.textValue,
  () => {
    console.log('watched')
    exhaustedMark.value = false
  }
)

const filteredPreviews = computed(() => {
  if (globalFilter.textValue) {
    return previewArray.value.filter(item => {
      return item.name.includes(globalFilter.textValue)
    })
  } else {
    return previewArray.value
  }
})

const fetcher = async () => {
  const current = filteredPreviews.value.length
  pageLoading.value = true
  try {
    const body = {offset: current, limit: loadBatchSize.value, filter: globalFilter.textValue}
    const response = await axios.post('/api/list-preview', body)
    if (response.data.length === 0) {
      exhaustedMark.value = true
    } else {
      previewArray.value.push(...response.data)
    }
  } finally {
    pageLoading.value = false
  }
}

onMounted(fetcher)


const onIntersect = (bEntryState) => {
  if (bEntryState && !pageLoading.value && !exhaustedMark.value) {
    fetcher()
  }
}

const router = useRouter()
const onPreviewClicked = (videoPid) => {
  const href = '/video/' + videoPid
  router.push(href)
}
</script>
