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
              :class="{ marked: cell.marks.includes(key), active: hoveredMark === key || (inputMode && (activeValue === key)) }" />
      </span>
    </transition>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Cell } from '@/types'
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
    const store = useStore()
    const inputMode = computed(() => store.state.inputMode)
    const activeValue = computed(() => store.state.activeValue)
    const mark = (n: number) => emit('mark', n)
    const placeMarks = () => emit('valueClick')
    return {
      inputMode,
      activeValue,
      mark,
      placeMarks
    }
  }
})
</script>
