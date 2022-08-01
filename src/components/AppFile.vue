<template>
    <div
        :class="{
            'app-file': true,
            'app-file--error': isError
        }"
    >
        <div class="app-file__info-wrapper">
            <div class="app-file__spinner" v-if="isLoading" />
            <div class="app-file__error-icon" v-else-if="isError">!</div>
            <FileIcon v-else class="app-file__icon" />
            <div class="app-file__name">
                {{ name }}
            </div>
        </div>
        <CrossIcon class="app-file__remove-icon" @click="remove" />
    </div>
</template>

<script>
    import FileIcon from '@/assets/icons/file.svg?component'
    import CrossIcon from '@/assets/icons/cross.svg?component'

    export default {
        components: {
            FileIcon,
            CrossIcon
        },
        props: {
            name: {
                type: String,
                default: 'Файл'
            },
            size: {
                type: Number,
                default: 0
            },
            isLoading: {
                type: Boolean,
                default: false
            },
            isError: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            remove() {
                this.$emit('remove')
            }
        }
    }
</script>

<style lang="scss">
    .app-file {
        display: flex;
        color: #333;
        fill: #333;
        transition: all 0.3s ease;
        justify-content: space-between;
        align-items: center;

        &__info-wrapper {
            display: flex;
            align-items: center;
        }

        &:hover {
            fill: #0ca9ef;
            color: #0ca9ef;
            cursor: pointer;
        }

        &--error:hover {
            fill: red;
            color: red;
        }

        &__icon {
            width: 12px;
            fill: inherit;
            flex-shrink: 0;
        }

        &__name {
            margin-left: 8px;
            font-family: 'PT Sans', sans-serif;
            font-style: normal;
            font-weight: 400;
            font-size: 16px;
            line-height: 100%;
        }

        &__remove-icon {
            flex-shrink: 0;
            width: 12px;
            fill: #b0b6bb;
            transition: all 0.3s ease;

            &:hover {
                fill: red;
            }
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        &__spinner {
            box-sizing: border-box;
            width: 12px;
            height: 12px;
            border: 2px solid rgba(#0ca9ef, 0.5);
            border-right-color: #0ca9ef;
            border-radius: 100%;
            animation: spin 1s linear infinite;
        }

        &__error-icon {
            width: 12px;
            height: 12px;
            font-family: 'PT Sans', sans-serif;
            line-height: 1;
            font-size: 8px;
            box-sizing: border-box;
            border: 1px solid red;
            border-radius: 100%;
            color: red;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
    }
</style>
