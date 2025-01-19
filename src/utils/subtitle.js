export function convertSrtItemToWebVTT(subtitleArray, langArray) {
  let vttContent = "WEBVTT\n\n";

  subtitleArray.forEach((subtitle, index) => {
    const startTime = _formatTime(subtitle.start_at);
    const endTime = _formatTime(subtitle.end_at);
    vttContent += `${index + 1}\n`;
    vttContent += `${startTime} --> ${endTime}\n`;

    langArray.forEach(lang => {
      const text = subtitle.texts.find(t => t.lang === lang)?.text || "";
      vttContent += `${text}\n`;
    })

    vttContent += "\n";
  });

  return vttContent;
}


function _formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}
