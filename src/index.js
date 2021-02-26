import "./styles.css";

const video = document.getElementById("thevideo");

video.textTracks.addEventListener("addtrack", function (addTrackEvent) {
  console.log("addtrack triggered");
  var track = addTrackEvent.track;
  track.mode = "hidden";

  track.addEventListener("cuechange", function (cueChangeEvent) {
    //console.log(cueChangeEvent.target.cues[0].value);
    // console.log(cueChangeEvent);
    console.log(`cuechange: ${cueChangeEvent.target.cues.length} cues`);

    for (const cue of cueChangeEvent.target.cues) {
      if (cue.value.info === "programDateTime") {
        const pdt = new Date(cue.value.data);
        console.log(
          `EVENT PDT; DELTA=${(Date.now() - pdt.getTime()) / 1000}s; ${
            cue.startTime
          }-${cue.stopTime}`
        );
      } else {
        console.log(`EVENT ${cue.value.info} - ${cue.value.data}`);
        console.log(`START: ${cue.startTime}, END ${cue.endTime}`);
      }
    }
  });
});

const source =
  "https://cdn3.wowza.com/1/RWZBaU56S1RTQ2Vy/NllYTUN2/hls/live/playlist.m3u8";

if (Hls.isSupported()) {
  let hls = new Hls();
  hls.loadSource(source);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    video.play();
  });
} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
  video.src = source;
  video.addEventListener("canplay", function () {
    video.play();
  });
}
