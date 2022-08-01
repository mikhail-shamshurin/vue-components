<template>
    <div
        class="app-file-drop"
        @drop.prevent.stop="addDropFiles"
        @dragenter.stop.prevent
        @dragleave.stop.prevent
        @dragover.stop.prevent
        @click="openFileModal"
    >
        Перетащите
        <template v-if="this.multiple"> файлы </template>
        <template v-else> файл </template>
        сюда или
        <span class="app-file-drop__button"> нажмите </span>
        на эту область
        <input
            class="app-file-drop__core"
            type="file"
            @change="addFiles"
            :multiple="multiple"
            ref="core"
        />
    </div>
</template>

<script>
    export default {
        props: {
            multiple: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            openFileModal() {
                this.$refs?.core.click()
            },
            onInput(files) {
                if (this.multiple) return this.$emit('input', Array.from(files))

                return this.$emit('input', Array.from(files).slice(0, 1))
            },
            addDropFiles(event) {
                this.onInput(event.dataTransfer.files)
            },
            addFiles(event) {
                this.onInput(event.target.files)
            }
        }
    }
</script>

<style lang="scss">
    .app-file-drop {
        background: #ffffff;
        border: 1px dashed #b0b6bb;
        border-radius: 6px;
        padding: 16px 26px;
        font-family: 'PT Sans';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        text-align: center;
        color: #b0b6bb;
        cursor: pointer;
        transition: all 0.1s ease;

        &:hover {
            background: #f7f8f8;
        }

        &__button {
            color: #0ca9ef;
        }

        &__core {
            display: none;
        }
    }
</style>
