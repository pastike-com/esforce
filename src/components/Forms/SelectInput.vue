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

<style scoped lang="scss">
input:not([type]),
input[type="text"]:not(.browser-default),
input[type="password"]:not(.browser-default),
input[type="email"]:not(.browser-default),
input[type="url"]:not(.browser-default),
input[type="time"]:not(.browser-default),
input[type="date"]:not(.browser-default),
input[type="datetime"]:not(.browser-default),
input[type="datetime-local"]:not(.browser-default),
input[type="tel"]:not(.browser-default),
input[type="number"]:not(.browser-default),
input[type="search"]:not(.browser-default),
input[type="phone"]:not(.browser-default),
input[type="search-md"] {
  box-sizing: content-box;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #ced4da;
  border-radius: 0;
  outline: 0;
  box-shadow: none;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
  width: 100%;
}
input:read-only {
  cursor: pointer;
}
.form-control {
  height: auto;
  padding: 0.6rem 0 0.4rem 0;
  margin: 0 0 0.5rem 0;
  background-color: transparent;
  border-radius: 0;
}
.form-control:disabled, .form-control[readonly] {
  background-color: transparent;
  border-bottom: 1px solid #bdbdbd;
}
</style>
