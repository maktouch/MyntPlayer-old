<script>
  import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
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
    color: red;
    position: absolute;
    right: 6px;
    top: 7px;
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
</style>

<div class="Container">
  <div class="Search">
    <input class="input" placeholder="Add videos to the queue" />
    <div class="search-icon">
      <FaSearch />
    </div>

  </div>
</div>
