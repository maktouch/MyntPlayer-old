<script>
  import { queue as store } from './store';
  import { slide } from 'svelte/transition';
  import Youtube from './lib/youtube';
  import FaArrowUp from 'svelte-icons/fa/FaArrowUp.svelte';
  import FaPlusSquare from 'svelte-icons/fa/FaPlusSquare.svelte';
  import FaAngleDoubleUp from 'svelte-icons/fa/FaAngleDoubleUp.svelte';
  import FaTrash from 'svelte-icons/fa/FaTrash.svelte';

  let queue = [];
  let lastVideo;

  const unsubscribe = store.subscribe(value => {
    queue = value;

    if (value.length > 0) {
      lastVideo = value[value.length - 1];
    }
  });

  const addMore = async e => {
    e.preventDefault();

    if (!lastVideo) {
      return;
    }

    const results = await Youtube('', { relatedToVideoId: lastVideo.id, maxResults: 5 });
    store.addBatch(results);
  };
</script>

<style>
  .QueueContainer {
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .Title {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .Count {
    background: white;
    color: black;
    display: inline-flex;
    min-width: 20px;
    text-align: center;
    justify-content: center;
    border-radius: 3px;
    font-size: 14px;
    margin-left: 10px;
  }

  .Queue {
    transition: all 0.3s ease-in-out;
    position: relative;
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), var(--image-url) center center;
    background-size: 120%;
    background-repeat: no-repeat;
    padding: 10px;
    box-sizing: border-box;
    font-size: 12px;
    height: 50px;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .Queue:hover .QueueOverlay {
    display: flex;
  }

  .QueueOverlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 0, 0, 0.3);
    display: none;
    align-items: center;
    padding: 0 2em;
    justify-content: flex-end;
  }

  button {
    display: flex;
    border: none;
    height: 25px;
    margin-right: 10px;
    border-radius: 3px;
    align-items: center;
  }

  .AddMore {
    margin-top: 15px;
  }

  .button-icon {
    display: flex;
    width: 15px;
  }

  h2 {
    text-align: center;
    padding: 10px;
  }

  .arrow-up {
    margin: 0 auto;
    width: 30px;
  }
</style>

<div>
  <h3 class="Title">
    Queued videos
    <span class="Count">{queue.length}</span>
  </h3>

  <div class="QueueContainer">
    {#each queue as item, index}
      <div class="Queue" key={item.id} style={`--image-url: url(${item.src})`} transition:slide>
        <div class="QueueTitle">
          {@html item.title}
        </div>
        <div class="QueueOverlay">
          {#if index > 1}
            <button
              on:click={e => {
                e.preventDefault();
                store.playNext(index);
              }}>
              Play Next
              <div class="button-icon" style="margin-left: 5px">
                <FaAngleDoubleUp />
              </div>
            </button>
          {/if}

          <button
            on:click={e => {
              e.preventDefault();
              store.remove(item.id);
            }}>
            <div class="button-icon">
              <FaTrash />
            </div>
          </button>
        </div>
      </div>
    {/each}

    {#if queue.length === 0}
      <h2>
        <div class="arrow-up">
          <FaArrowUp />
        </div>

        <br />
        Your video queue is empty. Use the search input bar and add one!
      </h2>
    {/if}

    {#if queue.length > 0}
      <button class="AddMore" on:click={addMore}>
        <div class="button-icon" style="margin-right: 5px">
          <FaPlusSquare />
        </div>
        Add related videos
      </button>
    {/if}

  </div>
</div>
