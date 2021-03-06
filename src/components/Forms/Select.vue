<template>
  <div class="select-outer">
    <div class="select-wrapper es-form" v-click-outside.mousedown="away">
      <template v-if="touch">
        <select v-model="touchSelected">
          <option value="" disabled selected hidden>{{ placeholder }}</option>
          <option
            v-for="(option, index) in data"
            :key="index"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
      </template>
      <template v-else>
        <span :class="caretClasses">{{ toggle ? "▲" : "▼" }}</span>
        <SelectInput
          ref="input"
          :aria-owns="id"
          :disabled="disabled"
          :placeholder="placeholder"
          :text="inputText"
          :toggle="toggle"
          :value="inputValue"
          @active="focused = true"
          @keydown.native.stop="handleKeydown"
          @mousedown.native.left="toggleOptions"
        />
        <keep-alive>
          <SelectOptions
            class="collapse-item"
            :id="id"
            :show="toggle"
            @close="handleEscClose"
          >
            <SelectOption
              v-for="(option, index) in data"
              :key="index"
              ref="option"
              :value="option.value"
              :active="option.selected"
              @select="getSelectedOption"
              @keydown.native.prevent="navigateOptions($event)"
            >
              {{ option.text }}
            </SelectOption>
          </SelectOptions>
        </keep-alive>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, ModelSync, Prop, Vue, Watch } from "vue-property-decorator";
import { ISelectOption } from "./interface";
import SelectInput from "./SelectInput.vue";
import SelectOption from "./SelectOption.vue";
import SelectOptions from "./SelectOptions.vue";

@Component({
  components: {
    SelectInput,
    SelectOption,
    SelectOptions,
  },
})
export default class Select extends Vue {
  @Prop({ default: false, type: Boolean })
  readonly disabled?: boolean;

  @Prop({ required: true, type: [Array, Object] })
  readonly options!: ISelectOption[] | string[] | object; // eslint-disable-line @typescript-eslint/ban-types

  @Prop({ type: String })
  readonly placeholder?: string;

  @ModelSync("value", "input", { required: true, type: Array })
  readonly selected!: string[];

  private activeOption = 0;

  private data: ISelectOption[] = [];

  private defaultIndex = 0;

  private focused = false;

  private id = "";

  private inputText = "";

  private inputValue: null | string = null;

  private preselectedIndex = 0;

  private selectedItems: number[] = [];

  private toggle = false;

  private touch = true;

  private touchSelected = "";

  created() {
    this.setData();

    this.setSelected();

    this.checkDefaultData();

    this.renderInput();
  }

  mounted() {
    this.id = `select-${Math.floor(Math.random() * 1000000)}`;

    this.touch = Boolean("ontouchstart" in window || navigator.maxTouchPoints);

    this.activeOption =
      this.selectedItems.length > 0 ? this.selectedItems[0] : 0;
  }

  get caretClasses(): string[] {
    return [
      "caret",
      this.disabled ? "disabled" : "",
      this.toggle ? "active" : "",
    ];
  }

  public away(): void {
    if (this.toggle) {
      this.toggle = false;
    }
  }

  public changeSelected(direction: "start" | "end" | number): void {
    let next;

    if (direction === "start" || direction === "end") {
      next = direction === "start" ? 0 : this.data.length - 1;
    } else {
      let current = this.activeOption;
      if (current === -1) {
        next = 0;
      } else {
        next = current + direction;
        next =
          next > this.data.length - 1
            ? 0
            : next < 0
            ? this.data.length - 1
            : next;
      }
    }

    this.activeOption = next;

    if (this.toggle) {
      // @ts-ignore
      this.$refs.option[next].$el.focus();
    } else {
      const selectedOption = this.data[next];

      this.getSelectedOption(selectedOption.value, selectedOption.text);
    }
  }

  public checkDefaultData(): void {
    const [index] = this.selectedItems;

    this.defaultIndex = index > -1 ? index : -1;

    return;
  }

  public focusInputField(): void {
    // @ts-ignore
    const [nativeInput] = this.$refs.input.$el.getElementsByTagName("input");
    nativeInput.focus();
  }

  public getSelectedOption(value: string, text: string): void {
    this.data.forEach((option) => {
      option.selected = false;
    });
    this.selected.splice(0, this.selected.length);

    this.$set(
      // @ts-ignore
      this.data.find((x) => x.value === value),
      "selected",
      true
    );
    this.selected.push(value);

    this.inputValue = value;
    this.inputText = text;

    this.away();
  }

  @Watch("touchSelected")
  public getSelectedTouchOption(): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(this.touchSelected);
  }

  public handleEscClose(): void {
    this.toggle = false;

    this.focusInputField();
  }

  public handleKeydown(e: any): void {
    this.activeOption =
      this.selectedItems.length > 0 ? this.selectedItems[0] : -1;

    const active = this.activeOption > 0 ? this.activeOption : 0;

    switch (e.keyCode) {
      case 13:
      case 32:
        e.preventDefault();

        this.toggle = true;

        // @ts-ignore
        this.$refs.option[active].$el.focus();

        break;
      case 40:
        e.preventDefault();

        this.changeSelected(1);

        break;
      case 38:
        e.preventDefault();

        if (e.altKey && this.toggle) {
          this.toggle = false;
        } else {
          this.changeSelected(-1);
        }

        break;
      case 27:
        this.toggle = false;

        break;
      case 36:
        e.preventDefault();

        this.changeSelected("start");

        break;
      case 35:
        e.preventDefault();

        this.changeSelected("end");

        break;
    }
  }

  public navigateOptions(e: any): void {
    e.preventDefault();

    switch (e.keyCode) {
      case 40:
        this.changeSelected(1);
        break;
      case 38:
        this.changeSelected(-1);
        break;
      case 27:
        this.toggle = false;
        this.focusInputField();
        break;
      case 36:
        this.changeSelected("start");
        break;
      case 35:
        this.changeSelected("end");
        break;
    }
  }

  @Watch("data")
  public renderInput(): void {
    this.setSelected();

    if (this.selectedItems.length === 0) {
      this.inputValue = null;
      this.inputText = "";
      return;
    }
    if (this.data.length === 0) return;

    this.selectFirstAvailableOption();
    this.inputValue = this.data.find((x) => x.selected === true)?.value || null;
    this.inputText = this.data.find((x) => x.selected === true)?.text || "";
  }

  public setData(): void {
    if (Array.isArray(this.options)) {
      this.options.forEach((item) => {
        if (typeof item === "object") {
          if ("text" in item && "value" in item) {
            this.data.push({
              text: item.text,
              value: item.value,
            });
          }
        } else {
          this.data.push({
            text: String(item),
            value: String(item),
          });
        }
      });
    } else if (typeof this.options === "object") {
      Object.keys(this.options).forEach((index) => {
        // @ts-ignore
        const item = this.options[index];
        if (typeof item === "object") {
          if ("text" in item && "value" in item) {
            this.data.push({
              text: item.text,
              value: item.value,
            });
          }
        } else {
          this.data.push({
            text: String(item),
            value: String(item),
          });
        }
      });
    }
  }

  public setSelected(): void {
    this.selectedItems = this.data
      .map((option, i) => {
        // @ts-ignore
        option.index = i;
        return option;
      })
      .filter((option) => option.selected)
      .map((option) => {
        // @ts-ignore
        return option.index;
      });
  }

  public selectFirstAvailableOption(): void {
    let checkPreselected = false;

    this.data.forEach((option, index) => {
      if (option.selected === true) {
        checkPreselected = true;
        this.preselectedIndex = index;
      }
    });

    if (!checkPreselected) {
      this.preselectedIndex = 0;
      this.data[this.preselectedIndex].selected = true;
      this.$set(
        this.data,
        this.preselectedIndex,
        this.data[this.preselectedIndex]
      );
    }
  }

  public toggleOptions(): void {
    if (this.disabled) {
      return;
    }

    this.toggle = !this.toggle;
  }
}
</script>

<style scoped lang="scss">
.select-wrapper {
  position: relative;

  span.caret {
    position: absolute;
    top: 0.8rem;
    right: 0;
    font-size: 0.63rem;
    color: #495057;

    &.disabled {
      color: rgba(0, 0, 0, 0.3);
    }
  }
}

select {
  box-sizing: content-box;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid #ced4da;
  border-radius: 0;
  outline: 0;
  box-shadow: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  width: 100%;
  height: auto;
  padding: 0.6rem 0 0.4rem 0;
  margin: 0 0 0.5rem 0;
}
select:disabled,
select[readonly] {
  background-color: transparent;
  border-bottom: 1px solid #bdbdbd;
}
</style>
