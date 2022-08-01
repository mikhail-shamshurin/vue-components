<template>
    <div class="app-file-selector">
        <input
            ref="core"
            class="app-file-selector__core"
            type="file"
            :multiple="multiple"
            @change="($event) => uploadFiles($event.target.files)"
        />
        <div class="app-file-selector__files-wrapper">
            <slot
                v-for="(file, index) of files"
                v-bind="{
                    ...file,
                    ...fileToObject(file.fileInfo),
                    removeFile: removeFile.bind(null, index)
                }"
                name="file"
            />
        </div>
        <slot
            name="add"
            v-bind="{
                openFileModal,
                uploadFiles
            }"
        >
            <button class="app-file-selector__button" @click="openFileModal">Выбрать файлы</button>
        </slot>
    </div>
</template>

<script>
    export default {
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
        data: () => ({
            isLoading: false,
            files: [],
            paths: []
        }),
        methods: {
            openFileModal() {
                this.$refs.core.click()

                this.$emit('input', this.value)
            },
            removeFile(index) {
                this.files.splice(index, 1)
                this.paths.splice(index, 1)

                this.$emit('input', this.value)
            },
            fileToObject(file) {
                return {
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    webkitRelativePath: file.webkitRelativePath
                }
            },
            async uploadFiles(files) {
                this.isLoading = true
                if (this.multiple) {
                    this.files.push(
                        ...Array.from(files).map((file, index) => ({
                            index,
                            isLoading: true,
                            isError: false,
                            fileInfo: file
                        }))
                    )
                } else {
                    this.files = Array.from(files).map((file, index) => ({
                        index,
                        isLoading: true,
                        isError: false,
                        fileInfo: file
                    }))
                }

                const unuploaded = this.files.filter((file) => file.path === undefined)
                await Promise.all(unuploaded.map((file) => this.fileUpload(file)))

                this.isLoading = false
            },
            async fileUpload(file, allowedTypes = []) {
                try {
                    file.path = null
                    const body = new FormData()

                    const hasNotAllowed =
                        allowedTypes?.length &&
                        !allowedTypes.some((type) => file.type.includes(type))

                    if (hasNotAllowed) {
                        throw new Error('Contains not allowed types')
                    }

                    body.append('file', file.fileInfo, file.fileInfo.name)

                    const url = Url.route('file.upload.common')
                    const response = await axios.post(url, body)

                    file.isLoading = false
                    file.path = response.data.virtualPath

                    this.$emit(
                        'input',
                        this.files.map((file) => file.path)
                    )
                } catch (error) {
                    console.log("Can't upload file – ", error), (file.isLoading = false)
                    file.isLoading = false
                    file.isError = true
                }
            }
        }
    }
</script>

<style lang="scss">
    .app-file-selector {
        &__core {
            display: none;
        }
    }
</style>
