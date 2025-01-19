<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import {useDisplay} from "vuetify";
import {convertSrtItemToWebVTT} from '@/utils/subtitle.js'

const route = useRoute();
const pageID = route.params.id;

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
    console.log(vttInText)
    const vttInB64 = URL.createObjectURL(new Blob([vttInText], {type: 'text/vtt'}))
    return vttInB64
  } else {
    return null
  }
})
const fetchMeta = async () => {
  const response = await axios.post('/api/video-ts', {video_pid: pageID});
  // 引入预览
  sceneArray.value = response.data.ts_list;

  // 引入字幕
  if (response.data.srt_list.length > 0) {
    const allLang = response.data.srt_list[0].texts.map(item => item.lang)
    srtArray.value = response.data.srt_list;
    vttLangArray.value = allLang
    selectedLangArray.value = allLang
  }
};

onMounted(fetchMeta);

const videoUrl = computed(() => {
  return `/api/video-full/${pageID}`;
});

const videoPlayer = ref(null);


const seekToTime = (time) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time;
  }
}

const display = useDisplay();
const boxWidth = computed(() => {
  return display.lgAndUp.value ? '70vw' : '100vw'
});
</script>

<template>
  <v-container class="d-flex align-center">
    <v-responsive :width="boxWidth">
      <video
        ref="videoPlayer"
        :src="videoUrl"
        controls
        preload="metadata"
        width="100%"
        :poster="posterImage"
        controlslist="nodownload"
      >
        <track
          :src="vtt"
          kind="subtitles"
          default
        >
      </video>
      <div>
        <div v-for="srtItem in srtArray">
          <div @click="seekToTime(srtItem.start_at)">
            <span>{{ srtItem.texts[0].text }}</span>
            <span>{{ srtItem.texts[1].text }}</span>
          </div>
        </div>
      </div>
      <v-row>
        <v-col
          v-for="scene in sceneArray"
          :key="scene.ts"
          cols="2"
        >
          <v-img
            :src="scene.preview"
            @click="seekToTime(scene.ts)"
          />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped>

</style>
