<script>
  import { onMount, onDestroy } from 'svelte';
  import Header from './Header.svelte';
  import Player from './Player.svelte';
  import QR from './QR.svelte';
  import Queue from './Queue.svelte';
  import Search from './Search.svelte';

  import { queue as store } from './store';
  import WS from './lib/WS';

  export let masterId;

  onMount(function() {
    WS.on(`${masterId}:state-request`, function() {
      WS.emit(`sync`, { state, masterId });
    });

    WS.on(`${masterId}:add-batch`, function({ videos }) {
      store.addBatch(videos);
    });

    WS.on(`${masterId}:add`, function({ video }) {
      store.add(video);
    });

    WS.on(`${masterId}:remove`, function({ id }) {
      store.remove(id);
    });
  });

  onDestroy(function() {
    WS.off(`${masterId}:add-batch`);
    WS.off(`${masterId}:add`);
    WS.off(`${masterId}:play-next`);
    WS.off(`${masterId}:remove`);
    WS.off(`${masterId}:state-request`);
    WS.off(`${masterId}:sync`);
  });
</script>

<style>
  .App {
    height: 100vh;
    display: grid;
    grid-template-columns: auto 250px;
    grid-template-rows: 35px auto;
    grid-template-areas:
      'header search'
      'player sidebar';
    background: black;
    color: white;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-size: 14px;
    padding: 0 5px;
  }

  .Sidebar {
    grid-area: sidebar;
    overflow-y: auto;
  }
</style>

<div class="App">
  <Header />
  <Search />
  <Player />
  <div class="Sidebar">
    <Queue />
  </div>

  <QR {masterId} />
</div>
