<template>
    <app-file-uploader
        ref="uploader"
        :value="value"
        class="app-files-input"
        @input="onInput"
        :multiple="multiple"
    >
        <app-file
            class="app-files-input__file"
            slot="file"
            slot-scope="file"
            v-bind="file"
            @remove="file.removeFile"
        />
        <app-file-drop
            slot="add"
            slot-scope="scope"
            @input="(files) => scope.uploadFiles(files)"
            :multiple="multiple"
        />
    </app-file-uploader>
</template>

<script>
    import AppFile from './AppFile.vue'
    import AppFileUploader from './AppFileUploader.vue'
    import AppFileDrop from './AppFileDrop.vue'

    export default {
        components: { AppFileUploader, AppFile, AppFileDrop },
        props: {
            value: {
                type: Array,
                default: () => [],
                required: true
            },
            multiple: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onInput(value) {
                this.$emit('input', value)
            }
        },
        mounted() {
            this.$watch(
                () => this.$refs.uploader.isLoading,
                (newValue, oldValue) => {
                    if (!oldValue && newValue) return this.$emit('start-upload')
                    if (oldValue && !newValue) return this.$emit('end-upload')
                }
            )
        }
    }
</script>

<style lang="scss">
    .app-files-input {
        &__file {
            margin-bottom: 10px;
        }
    }
</style>
