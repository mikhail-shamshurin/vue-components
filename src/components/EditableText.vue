<template>
    <div
        :class="{
            'editable-text': true,
            'editable-text--no-value': !value,
        }"
        tabindex="0"
        @focus="startEdit"
        @focusout="stopEdit"
        @mouseenter="mouseEnter"
        @mouseleave="mouseLeave"
    >
        <component
            @input="changeValue"
            ref="component"
            :is="tag"
            v-text="value || placeholder"
        ></component>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        defaultTag: {
            type: String,
            default: 'div'
        },
        editTag: {
            type: String,
            default: 'textarea',
            validation: (value) => {
                const allowed = ['input', 'textarea']

                if (!allowed.includes(value)) {
                    console.warn(
                        `<EditableText> The "editTag" prop must be one of ${allowed.join(
                            ', '
                        )}.Now it has "${value}" value.`
                    )

                    return false
                }

                return true
            }
        },
        placeholder: {
            type: String,
            default: 'Нажмите для редактирования'
        }
    },
    computed: {
        tag() {
            return this.isEditMode ? this.editTag : this.defaultTag
        }
    },
    data: () => ({
        isEditMode: false,
        mouseIn: false
    }),
    methods: {
        changeValue(event) {
            this.$emit('input', event.target.value)
            this.setAutoHeight()
        },
        setAutoHeight() {
            this.$refs.component.style.height = '0px'
            this.$refs.component.style.height = `${this.$refs.component.scrollHeight}px`
        },
        startEdit() {
            this.isEditMode = true

            Vue.nextTick(() => {
                this.$refs.component.focus()
                this.setAutoHeight()

                if (!this.value) {
                    this.$refs.component.value = ''
                }
            })
        },
        stopEdit(event, ignoreMouse = false) {
            if (!this.mouseIn || ignoreMouse) {
                this.isEditMode = false
            }

            if (!this.value) {
                this.$refs.component.value = this.placeholder
            }
        },
        mouseEnter() {
            this.mouseIn = true
        },
        mouseLeave() {
            this.mouseIn = false
        }
    },
    mounted() {
        const slots = this.$slots

        if (!slots.default || slots.default.length === 0) {
            return
        }

        this.$emit('input', slots.default[0].text)
    }
}
</script>

<style scoped lang="scss">
    .editable-text {
        cursor: text;

        &--no-value {
            opacity: 0.5;
        }

        textarea {
            all: inherit;
            outline: none;
            border: none;
            resize: none;
            overflow: hidden;
            width: 100%;
        }
    }
</style>
