<template>
  <form role="combobox" :aria-expanded="`${toggle}`" :aria-owns="ariaOwns">
    <div class="form-control">
      <input
        readonly="readonly"
        ref="input"
        type="text"
        :aria-disabled="disabled"
        :aria-haspopup="true"
        :data-value="data"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="text"
        @blur="toggleActive($event, 'blur')"
        @focus="toggleActive($event, 'focus')"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { Component, ModelSync, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SelectOption extends Vue {
  @Prop({ type: String })
  readonly ariaOwns?: string;

  @Prop({ default: false, type: Boolean })
  readonly disabled?: boolean;

  @Prop({ type: String })
  readonly placeholder?: string;

  @Prop({ type: String })
  readonly text!: string;

  @Prop({ default: false, type: Boolean })
  readonly toggle?: boolean;

  @ModelSync("value", "input", { type: [String] })
  readonly data!: null | string;

  private active = false;

  public toggleActive(event: any, emit: string): void {
    if (emit === "focus") {
      this.active = true;
    } else {
      this.active = false;
    }

    this.$emit(emit, event);
  }

  @Watch("active")
  onActive(val: boolean, oldVal: boolean) {
    this.$emit("active", val);
  }
}
</script>

<style scoped lang="scss"></style>
