<template>
    <div
        :class="{
            'app-little-select': true,
            'app-little-select--open': isOpen,
        }"
        tabindex="2"
        ref="component"
    >
        <div
            class="app-little-select__selected-value"
            @click="toggleSelect"
        >
            <slot name="selected" v-bind="value">
                {{ selected.text }}
            </slot>
            <div
                :class="{
                    'app-little-select__open-icon': true,
                    'app-little-select__open-icon--open': isOpen
                }"
            >
                <slot name="icon">
                    <arrow-icon />
                </slot>
            </div>
        </div>
        <expand-transition
            class="app-little-select__options"
            tag="div"
        >
            <div
                v-if="isOpen"
                class="app-little-select__options-wrapper"
            >
                <div
                    v-for="(option, index) of otherOptions"
                    :key="index"
                    class="app-little-select__option"
                    @click="select(option)"
                >
                    <slot v-bind="option" name="option">
                        {{ option.text }}
                    </slot>
                </div>
            </div>
        </expand-transition>
    </div>
</template>

<script>
import ArrowIcon from '../assets/arrow-right.svg?component'
import ExpandTransition from './ExpandTransition.vue'

export default {
    components: {
        ArrowIcon,
        ExpandTransition
    },
    props: {
        value: {
            type: Number,
            default: 0
        },
        options: {
            type: Array,
            required: true
        }
    },
    computed: {
        selected() {
            return this.options.find((option) => option.id === this.value)
        },
        otherOptions() {
            return this.options.filter((option) => option.id !== this.value)
        }
    },
    data: () => ({
        isOpen: false
    }),
    methods: {
        select(item) {
            this.$emit('input', item.id)
            this.closeSelect()
        },
        openSelect() {
            this.isOpen = true
        },
        closeSelect() {
            if (!this.isOpen) return undefined

            this.isOpen = false
            this.$refs.component.blur()

            return false
        },
        toggleSelect() {
            if (this.isOpen) {
                return this.closeSelect()
            }

            return this.openSelect()
        }
    }
}
</script>

<style lang="scss">
    .app-little-select {
        position: relative;
        display: inline-block;
        cursor: pointer;
        background: #ffffff;
        box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        font-family: PT Sans, sans-serif;
        font-style: normal;
        transition: border-radius .1s linear 0.25s;

        &--open {
            border-radius: 10px 10px 0 0;
            transition: border-radius .1s ease 0s;
        }

        &__selected-value {
            border-radius: inherit;
            font-weight: bold;
            font-size: 16px;
            line-height: 140%;
            padding-bottom: 4px;
            color: #333333;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 10px;
            position: relative;
            z-index: 2;
            background: white;

            * {
                flex-shrink: 0;
            }
        }

        &__open-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;

            &--open {
                transform: rotate(-180deg);
            }
        }

        &__options-wrapper {
            position: absolute;
            width: 100%;
            border-radius: 0 0 10px 10px ;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            z-index: 1;
        }

        &__option {
            font-weight: bold;
            font-size: 16px;
            line-height: 140%;
            color: #333333;
            background: white;
            padding: 4px 10px;
            position: relative;
            transition: .3s ease;

            &::before {
                --size: 4px;
                content: '';
                display: block;
                position: absolute;
                top: 0px;
                background: #F2F2F2;
                height: 1px;
                border-radius: 1px;
                left: var(--size);
                width: calc(100% - var(--size) * 2);
            }

            &:hover {
                filter: brightness(90%);
            }
        }
    }
</style>
