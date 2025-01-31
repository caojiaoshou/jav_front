export function convertSrtItemToWebVTT(subtitleArray, langArray) {
  let vttContent = "WEBVTT\n\n";

  subtitleArray.forEach((subtitle, index) => {
    const startTime = formatTime(subtitle.start_at, true, true);
    const endTime = formatTime(subtitle.end_at, true, true);
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


export function formatTime(seconds, withMilliseconds, ensureHours) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000)

  let res = ''
  if (hours > 0 || ensureHours) {
    res += `${hours.toString()}:`
  }
  if (res) {
    res += `${minutes.toString().padStart(2, '0')}:`
  } else {
    res += `${minutes.toString()}:`
  }

  if (res) {
    res += `${secs.toString().padStart(2, '0')}`
  } else {
    res += `${secs.toString()}`
  }

  if (withMilliseconds) {
    res += `.${milliseconds.toString().padStart(3, '0')}`
  }

  return res

}
