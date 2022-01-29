<template>
  <div id="app">
    <Select v-model="basicOptions" placeholder="Select an option" style="width: 300px; margin: 20px;" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISelectOption } from "./components/Forms/interface";
import Select from "./components/Forms/Select.vue";

@Component({
  components: {
    Select,
  },
})
export default class App extends Vue {
  private basicOptions: ISelectOption[] = [
    { text: "Option nr 1", value: "Option 1" },
    { text: "Option nr 2", value: "Option 2" },
    { text: "Option nr 3", value: "Option 3" },
  ];
}
</script>

<style lang="scss">
#app {
}
</style>
