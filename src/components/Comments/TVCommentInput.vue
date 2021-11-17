<template>
    <div
        tabindex="0"
        :class="{
            'comment-input': true,
            'comment-input--disabled': disabled,
        }"
        @focus="focus"
    >
        <div class="comment-input__field-wrapper">
            <img
                v-if="avatar !== undefined"
                class="comment-input__avatar"
                :src="avatar"
            >
            <div class="comment-input__input-wrapper">
                <textarea
                    v-model="text"
                    ref="textarea"
                    :class="{
                        'comment-input__textarea': true,
                        'comment-input__textarea--auto-resize': autoResize
                    }"
                    :disabled="disabled"
                    :placeholder="placeholder"
                    @input="setSize"
                    @keydown.ctrl.enter="submit"
                />
            </div>
            <cross-icon
                v-if="closable"
                class="comment-input__close"
                @click="close"
            />
        </div>
        <div class="comment-input__submit-wrapper">
            <button
                class="comment-input__submit"
                :disabled="disabled || text.length < minimalLength"
                @click="submit"
            >
                Отправить
            </button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import CrossIcon from '../../assets/cross.svg?component'

export default {
    components: {
        CrossIcon
    },
    props: {
        extraSpaces: {
            type: Boolean,
            default: false
        },
        avatar: {
            type: String,
            required: false
        },
        placeholder: {
            type: String,
            required: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: false
        },
        autoResize: {
            type: Boolean,
            default: false
        },
        focusOnMount: {
            type: Boolean,
            default: false
        },
        minimalLength: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            text: this.getDefaultText()
        }
    },
    computed: {
        $textarea() {
            return this.$refs.textarea
        }
    },
    methods: {
        submit() {
            const text = !this.extraSpaces
                ? this.text.trim().replace(/ +/g, ' ')
                : this.text
            this.$emit('submit', text)
        },
        getDefaultText() {
            if (this.$slots.default && this.$slots.default.length) {
                return this.$slots.default[0].text
            }

            return ''
        },
        focus() {
            this.$textarea.focus()
        },
        clear() {
            this.text = ''

            if (this.autoResize) {
                this.setSize()
            }
        },
        close(event) {
            this.$emit('close', event)
        },
        setSize() {
            if (!this.autoResize) return

            this.$textarea.style.height = '0px'
            this.$textarea.style.height = `${this.$textarea.scrollHeight}px`
        }
    },
    mounted() {
        if (!this.focusOnMount) return

        Vue.nextTick(() => {
            this.focus()
        })
    }
}
</script>

<style lang="scss">
    .comment-input {
        position: relative;
        font-family: "PT Sans", Arial, Helvetica, sans-serif;
        font-style: normal;
        font-size: 16px;
        line-height: 1.3;
        letter-spacing: 0.02em;
        color: #333333;
        box-sizing: border-box;
        padding: 10px;
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        box-sizing: border-box;
        border-radius: 4px;
        cursor: text;

        * {
            box-sizing: border-box;
        }

        &__field-wrapper {
            display: flex;
            margin-bottom: 17px;
        }

        &__submit-wrapper {
            display: flex;
            justify-content: flex-end;
        }

        &__avatar {
            flex-shrink: 0;
            width: 32px;
            height: 32px;
            display: block;
            object-fit: cover;
            border-radius: 100%;
        }

        &__input-wrapper {
            flex-grow: 1;

            &:not(:first-child) {
                margin-left: 10px;
            }

            &:not(:last-child) {
                margin-right: 10px;
            }
        }

        &__textarea {
            $color: #333333;

            color: $color;
            margin-top: 6px;
            font: inherit;
            width: 100%;
            display: block;
            border: none;
            resize: vertical;
            outline: none;
            appearance: none;
            background: transparent;
            height: 21px;
            min-height: 21px;
            padding: 0;

            &--auto-resize {
                overflow: hidden;
                resize: none;
            }

            &:disabled {
                color: lighten($color, 30%);
                background: transparent;
            }
        }

        &__close {
            $fill: #BDBDBD;

            flex-shrink: 0;
            cursor: pointer;
            fill: $fill;

            &:hover {
                fill: lighten($fill, 10%)
            }

            &:active {
                fill: lighten($fill, 15%)
            }
        }

        &__submit {
            $background: #0CA9EF;
            $color: white;

            cursor: pointer;
            font: inherit;
            font-size: 14px;
            color: $color;
            background: $background;
            appearance: none;
            border: none;
            outline: none;
            padding: 5px 17px 6px;
            border-radius: 100px;

            &:disabled {
                background: #F3F3F3;
                color: #333333;
                pointer-events: none;
            }

            &:hover {
                background: lighten($background, 10%);
                color: lighten($color, 10%);
            }

            &:active {
                background: lighten($background, 20%);
                color: lighten($color, 20%);
            }
        }
    }
</style>
