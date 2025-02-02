<template>
  <v-row
    no-gutters
    class="mx-10"
  >
    <v-col
      v-for="(previewItem,previewIndex) in filteredPreviews"
      :key="previewItem.video_pid"
      cols="6"
      md="4"
      lg="3"
      class="pa-1"
    >
      <a
        :href="'/video/' + previewItem.video_pid"
        target="_blank"
      >
        <preview
          :face-pid="previewItem.face_pid"
          :quick-look-pid="previewItem.quick_look_pid"
          :video-name="previewItem.name"
          :age="previewItem.age"
          :duration="previewItem.duration"
          :srt-ready="previewItem.srt_ready"
          :create-at="previewItem.create_at"
        />
      </a>

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
import {computed, onMounted, ref, watch} from 'vue'
import axios from "axios";
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
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
