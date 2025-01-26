<script setup>
import {useRoute} from "vue-router";
import {computed, ref, watch} from 'vue';
import axios from 'axios';
import {useDate, useDisplay} from "vuetify";
import {convertSrtItemToWebVTT} from '@/utils/subtitle.js'
import {useLocalHistory} from "@/stores/app.js";

const route = useRoute();


const sceneArray = ref([]);

const posterImage = computed(() => {
  if (sceneArray.value.length === 0) {
    return ''
  } else {
    for (let sceneItem in sceneArray) {
      if (sceneItem.reason === 'face') {
        return sceneItem.preview;
      }
    }
    return sceneArray.value[0].preview
  }
})


const vttLangArray = ref([])
const srtArray = ref([])
const selectedLangArray = ref([])

const vtt = computed(() => {
  if (vttLangArray.value.length > 0 && selectedLangArray.value.length > 0) {
    const vttInText = convertSrtItemToWebVTT(srtArray.value, selectedLangArray.value)
    const vttInB64 = URL.createObjectURL(new Blob([vttInText], {type: 'text/vtt'}))
    return vttInB64
  } else {
    return null
  }
})

const localHistory = useLocalHistory();

const videoTitle = ref(null)
const videoCreateAt = ref(null)
const dateFunc = useDate()
const fetchMeta = async () => {
  const response = await axios.post('/api/video-ts', {video_pid: route.params.id});
  // 引入预览
  sceneArray.value = response.data.ts_list;

  // 引入字幕
  if (response.data.srt_list.length > 0) {
    const allLang = response.data.srt_list[0].texts.map(item => item.lang)
    srtArray.value = response.data.srt_list;
    vttLangArray.value = allLang
    selectedLangArray.value = allLang
  }

  // 引入标题
  const {video_name, video_create_at} = response.data;
  videoTitle.value = video_name
  videoCreateAt.value = dateFunc.format(video_create_at, 'keyboardDateTime')

  // 添加历史记录
  localHistory.add(route.params.id, video_name, 'loaded')
};

// onMounted(fetchMeta);
watch(() => route.params.id, fetchMeta, {immediate: true})
const videoUrl = computed(() => {
  return `/api/video-full/${route.params.id}`;
});

const videoPlayer = ref(null);
const currentTime = ref(0)
const onTimeUpdated = () => {
  currentTime.value = videoPlayer.value.currentTime
}
const seekToTime = (time) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time;
  }
}

const logPlay = () => {
  localHistory.add(route.params.id, videoTitle.value, 'played')
}
const display = useDisplay();
const viewPortRemain = computed(() => display.height.value - 68)
</script>

<template>
  <v-row no-gutters>
    <v-col cols="2">
      <v-virtual-scroll
        :height="viewPortRemain"
        :items="sceneArray"
        class="rtl-scroller pr-4"
      >
        <template #default="{ item:scene }">
          <v-responsive :class="scene.ts < currentTime? 'opacity-50 position-relative' : 'position-relative'">
            <v-img
              class="rounded-lg mb-2"
              :src="scene.preview"
              @click="seekToTime(scene.ts)"
            />
            <v-chip
              :text="scene.reason.toUpperCase()"
              label
              color="blue-grey"
              variant="flat"
              class="opacity-70 text-black mb-4 mr-2 px-2 py-0 position-absolute bottom-0 right-0"
            />
          </v-responsive>
        </template>
      </v-virtual-scroll>
    </v-col>
    <v-col cols="8">
      <v-sheet>
        <div class="text-h4 mx-2 py-2">
          {{ videoTitle }}
        </div>
        <div class="text-subtitle-1 mx-2 py-2">
          {{ videoCreateAt }}
        </div>
        <div class="mt-8">
          <video
            ref="videoPlayer"
            :src="videoUrl"
            controls
            preload="metadata"
            width="100%"
            :poster="posterImage"
            controlslist="nodownload"
            @play="logPlay"
            @timeupdate="onTimeUpdated"
          >
            <track
              :src="vtt"
              kind="subtitles"
              default
            >
          </video>
        </div>
      </v-sheet>
    </v-col>
    <v-col cols="2">
      <v-virtual-scroll
        :height="viewPortRemain"
        :items="srtArray"
      >
        <template #default="{ item: srtItem }">
          <v-list-item
            :class="srtItem.end_at < currentTime?'opacity-50':''"
            lines="one"
            @click="seekToTime(srtItem.start_at)"
          >
            <v-list-item-title>{{ srtItem.texts[0].text }}</v-list-item-title>
            <v-list-item-subtitle v-if="srtItem.texts.length > 1">
              {{ srtItem.texts[1].text }}
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-col>
  </v-row>
</template>

<style scoped>
.rtl-scroller {
  direction: rtl;
}
</style>
