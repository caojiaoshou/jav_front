<template>
  <v-row no-gutters>
    <v-col
      v-for="(previewItem,previewIndex) in previewArray"
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
</template>

<script setup>
import Preview from "@/components/Preview.vue";
import {onMounted, ref} from 'vue'
import axios from "axios";
import {useRouter} from 'vue-router'

const previewArray = ref([])
const loadBatchSize = ref(20)
const pageLoading = ref(false)
const exhaustedMark = ref(false)

const fetcher = async () => {
  const current = previewArray.value.length
  pageLoading.value = true
  try {
    const body = {offset: current, limit: loadBatchSize.value}
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


const onIntersect = (entry) => {
  console.log(entry)
  if (entry && !pageLoading.value && !exhaustedMark.value) {
    fetcher()
  }
}

const router = useRouter()
const onPreviewClicked = (videoPid) => {
  const href = '/video/' + videoPid
  router.push(href)
}
</script>
