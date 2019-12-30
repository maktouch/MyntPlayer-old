<script>
  import { queue } from './store';
  import { slide, fade } from 'svelte/transition';
  import searchYoutube from './lib/youtube';
  import FaSearch from 'svelte-icons/fa/FaSearch.svelte';

  let query = '';
  let focused = false;
  let timer;
  let results = [];

  async function search(query) {
    if (query.length < 2) {
      return;
    }

    results = await searchYoutube(query);
  }

  const onFocus = e => (focused = true);
  const onBlur = e => {
    setTimeout(function() {
      focused = false;
    }, 100);
  };

  const debounce = v => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search(v);
    }, 250);
  };

  function onClick(e, item) {
    e.preventDefault();
    queue.add(item);
    query = '';
    focused = false;
    results = [];
  }
</script>

<style>
  .Container {
    grid-area: search;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .Search {
    height: 2em;
    width: 100%;
    box-sizing: border-box;
    border-radius: 20px;
    position: relative;
  }

  .search-icon {
    color: #8f908f;
    position: absolute;
    right: 6px;
    top: 7px;
    width: 14px;
  }

  .input {
    box-sizing: border-box;
    width: 100%;
    border-radius: 20px;
    border: none;
    height: 2em;
    padding-left: 10px;
  }

  .input::placeholder {
    color: #aaaaaa;
  }

  .SearchResults {
    position: absolute;
    top: 2.5em;
    background: #f1f1f1;
    width: 450px;
    right: 0;
    border-radius: 5px;
    color: #6f6f6f;
    margin-left: 1em;
  }

  .Result {
    display: grid;
    grid-template-columns: auto 80px;
    grid-template-rows: auto;
    grid-template-areas: 'title image';
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    border-bottom: 1px solid #eaeaea;
    cursor: pointer;
    min-height: 60px;
  }

  .Result:hover {
    background: #d8d8d8;
  }

  .ResultItem {
    grid-area: title;
    display: flex;
    align-items: center;
    padding-left: 1em;
  }

  .ResultImage {
    grid-area: image;
    width: 100%;
  }
</style>

<div class="Container">
  <div class="Search">
    <input
      class="input"
      placeholder="Add videos to the queue"
      bind:value={query}
      on:keyup={e => debounce(e.target.value)}
      on:focus={onFocus}
      on:blur={onBlur} />
    <div class="search-icon">
      <FaSearch />
    </div>

    {#if focused === true}
      <div class="SearchResults" in:fade>
        {#each results as item}
          <a href={item.link} class="Result" on:click={e => onClick(e, item)}>
            <span class="ResultItem">
              {@html item.title}
            </span>
            <img class="ResultImage" src={item.src} alt={item.title} />
          </a>
        {/each}
      </div>
    {/if}

  </div>
</div>
