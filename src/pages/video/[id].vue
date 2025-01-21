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

</script>

<template>
  <v-row no-gutters>
    <v-col cols="9">
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
      <v-sheet
        width="100%"
      >
        <v-slide-group
          show-arrows
          class="fill-height"
        >
          <v-slide-group-item v-for="scene in sceneArray">
            <v-card class="mx-2 my-0 pa-0">
              <v-card-text class="ma-0 pa-0">
                <v-img
                  min-width="15vw"
                  :src="scene.preview"
                  @click="seekToTime(scene.ts)"
                />
              </v-card-text>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </v-col>
    <v-col cols="3">
      <v-virtual-scroll
        height="100vh"
        :items="srtArray"
        item-height="2rem"
      >
        <template #default="{ item: srtItem }">
          <v-list-item
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

</style>
