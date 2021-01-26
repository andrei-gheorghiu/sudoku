<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <div class="board" :class="{ 'cell-selection': !usePad }">
          <cell-record v-for="cell in cells"
                       :key="cell.index"
                       :cell="cell" />
        </div>
      </div>
      <div class="col-md-4">
        <num-pad />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import gameData from '@/assets/data.json'
import CellRecord from './CellRecord.vue'
import NumPad from './NumPad.vue'
import { Cell } from '@/types'
import { StoreType } from '@/store'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SudokuBoard',
  components: {
    CellRecord,
    NumPad
  },
  setup () {
    const store: StoreType = useStore()
    const usePad = computed(() => store.state.usePad)
    const cells = computed((): Cell[] => store.state.cells)

    const calculate = () => store.dispatch('calculate')
    return {
      cells,
      usePad,
      calculate
    }
  },
  mounted () {
    this.$store.commit('resetBoard')
    setTimeout(() => {
      this.$store.commit('setCells', gameData.squares)
    }, 1e3)
    /* this.axios.get('/sudoku/new/?size=9&level=3')
      .then(r => {
        console.log(r)
        r.data.squares.forEach((c: Cell) => {
          this.cells[c.x + c.y * 9].value = c.value
        })
      }) */
  }
})
</script>
<style lang="scss" src="../assets/sudoku-board.scss" />
