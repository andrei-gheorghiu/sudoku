<template>
  <span class="cell">
    <svg viewBox="0 0 1 1"></svg>
    <transition name="scale" appear>
      <span v-if="cell.value"
            v-text="cell.value"
            :class="{ fixed: cell.fixed }"
            @click="placeMarks"
            :key="1"/>
      <span  v-else class="grid" :key="2">
        <span v-for="key in 9"
              v-text="key"
              :key="key"
              @click="mark(key)"
              :class="{ marked: cell.marks.includes(key), active: hoveredMark === key }" />
      </span>
    </transition>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Cell } from '@/types'
import { StoreType } from '@/store'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'CellRecord',
  props: {
    cell: {
      type: Cell,
      required: true
    },
    hoveredMark: {
      type: Number,
      default: null
    }
  },
  setup (props, { emit }) {
    const store: StoreType = useStore()
    const mark = (n: number) => emit('mark', n)
    const placeMarks = () => store.dispatch('placeMarks', props.cell.value)
    return {
      mark,
      placeMarks
    }
  }
})
</script>
