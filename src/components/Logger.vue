<template>
  <pre v-text="{ usePad, activeCellIndex, activeValue, hoveredValue }" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Logger',
  setup () {
    const store = useStore()
    const usePad = computed(() => store.state.usePad)
    const activeCellIndex = computed(() => store.state.activeCellIndex)
    const activeValue = computed(() => store.state.activeValue)
    const hoveredValue = computed(() => store.state.hoveredValue)
    return { usePad, activeValue, hoveredValue, activeCellIndex }
  }
})
</script>

<style scoped>
  pre {
    position: absolute;
    left: 0;
    top: 56px;
    padding: 1rem;
    height: calc( 100% - 56px);
    width: 300px !important;
    background-color: rgba(0,0,0,.65);
    color: white;
  }
</style>
