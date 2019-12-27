<script>
  import Header from './Header.svelte';
  import Search from './Search.svelte';
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

  .QR {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>

<div class="App">
  <Header />
  <Search />
  <div class="Sidebar">Sidebar</div>
</div>
