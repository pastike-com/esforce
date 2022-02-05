<template>
  <div id="app">
    <Select
      v-model="selected"
      :options="basicOptions"
      placeholder="Select an option"
      style="width: 300px; margin: 20px"
    />
    <div v-if="selected.length" style="margin: 20px">
      <span>Selected:&nbsp;</span>
      <span>{{ selected.join(", ") }}</span>
    </div>
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
  private primitiveOptions: string[] = ["Option 1", "Option 2", "Option 3"];
  private objectOptions = {
    property1: { text: "Option nr 1", value: "Option 1" },
    property2: "Option 2",
    property3: { text: "Option nr 3", value: "Option 3" },
  };

  private selected: string[] = [];
}
</script>

<style lang="scss">
#app {
}
</style>
