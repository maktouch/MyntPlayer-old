<script>
  import { queue as store } from './store';
  import Youtube from './lib/youtube';
  import YoutubePlayer from './YoutubePlayer.svelte';

  let videoId;
  let lastVideo;

  const unsubscribe = store.subscribe(value => {
    if (value.length === 0) {
      videoId = null;
      return;
    }

    const [current] = value;
    videoId = current.id;

    lastVideo = value[value.length - 1];
  });

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      fs: 0,
      showinfo: 0,
    },
  };

  const onEnd = async () => {
    store.onEnd();

    if (!lastVideo) {
      return;
    }

    const results = await Youtube('', { relatedToVideoId: lastVideo.id, maxResults: 5 });
    store.addBatch(results);
  };
</script>

<style>
  .PlayerWrapper {
    grid-area: player;
    position: relative;
  }

  :global(.Player) {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<div class="PlayerWrapper">
  <YoutubePlayer class="Player" {videoId} {opts} {onEnd} />
</div>
