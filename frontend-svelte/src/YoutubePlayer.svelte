<script>
  import YoutubePlayer from 'youtube-player';
  import { onMount, onDestroy } from 'svelte';

  const noop = () => {};

  export let videoId;
  export let opts = {}; // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
  export let onReady = noop;
  export let onError = noop;
  export let onPlay = noop;
  export let onStateChange = noop;
  export let onPause = noop;
  export let onEnd = noop;
  export let onPlaybackQualityChange = noop;
  export let onPlaybackRateChange = noop;

  const className = $$props.class || '';

  const PLAYER_STATE = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
  };

  let videoContainer;
  let player;
  let isReady = false;

  function createPlayer() {
    player = YoutubePlayer(videoContainer, {
      ...opts,
      videoId,
    });

    player.on('ready', event => {
      isReady = true;
      onReady(event);
    });
    player.on('error', onError);
    player.on('stateChange', event => {
      onStateChange(event);
      switch (event.data) {
        case PLAYER_STATE.ENDED:
          onEnd(event);
          break;

        case PLAYER_STATE.PLAYING:
          onPlay(event);
          break;

        case PLAYER_STATE.PAUSED:
          onPause(event);
          break;

        default:
      }
    });
    player.on('playbackRateChange', onPlaybackRateChange);
    player.on('playbackQualityChange', onPlaybackQualityChange);
  }

  onMount(() => {
    createPlayer();
  });

  onDestroy(() => {
    player.destroy();
  });

  $: (function() {
    if (!isReady) {
      return;
    }

    if (typeof videoId === 'undefined' || videoId === null) {
      player.destroy().then(createPlayer());
      return;
    }

    // set queueing options
    let autoplay = false;

    const newOpts = {
      videoId,
    };

    if ('playerVars' in opts) {
      autoplay = opts.playerVars.autoplay === 1;
    }

    // if autoplay is enabled loadVideoById
    if (autoplay) {
      player.loadVideoById(newOpts);
      return;
    }
    // default behaviour just cues the video
    player.cueVideoById(newOpts);
  })();
</script>

<div bind:this={videoContainer} class={className} />
