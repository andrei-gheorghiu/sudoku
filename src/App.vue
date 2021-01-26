<template>
  <header>
    <navbar />
  </header>
  <main role="main" class="container">
    <sudoku-board />
  </main>
  <footer class="footer">
    <div class="container">
      <span class="text-muted">Place sticky footer content here.</span>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import SudokuBoard from './components/SudokuBoard.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    SudokuBoard
  }
})
</script>

<style lang="scss">
#app {
  background-image: url("assets/paper.png");
  background-repeat: repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  > * {
    width: 100%;
    flex-grow: 0;
  }
  main {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  footer {
    padding: 1rem;
    background-color: #f3f3f3;
    border-top: 1px solid #fff;
  }
  .cell > * {
    cursor: pointer;
  }
  .scale-enter-active, .scale-leave-active {
    transition: all .35s cubic-bezier(.4,0,.2,1);
    opacity: 0;
    transform: scale(.5);
  }
  .scale-enter-to, .scale-leave-to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
