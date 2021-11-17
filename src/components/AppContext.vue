<template>
    <div class="app-dropdown-menu">
        <div ref="$handler" class="app-dropdown-menu__handler" @click="onToggle">
            <slot />
        </div>
        <transition name="fade">
            <div
                v-if="isVisible"
                :class="{
                    'app-dropdown-menu__list-positioning-helper': true,
                    [`app-dropdown-menu__list-positioning-helper--${position}`]: true
                }"
            >
                <div
                    :class="{
                        'app-dropdown-menu__list-arrow': true,
                        [`app-dropdown-menu__list-arrow--${position}`]: true
                    }"
                />
                <div
                    ref="$list"
                    :class="{
                        'app-dropdown-menu__list': true,
                        [`app-dropdown-menu__list--${position}`]: true
                    }"
                    :style="{
                        minWidth: width ? `${width}px` : null,
                        top: offsetBottom ? `${offsetBottom}px` : null
                    }"
                    tabindex="0"
                    @focusout="onHide"
                >
                    <section
                        v-for="(section, index) in sections"
                        :key="index"
                        class="app-dropdown-menu__section"
                    >
                        <div
                            v-for="item in section"
                            :key="item.alias"
                            :style="{ color: item.color || null }"
                            class="app-dropdown-menu__section-item"
                            @click.prevent="onItemClick(item.alias)"
                        >
                            <slot name="item" :item="item">
                                {{ item.name }}
                            </slot>
                        </div>
                    </section>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue'

const isAppDropdownMenuSectionItem = (item) => {
    if (!item) return false
    if (item.name === undefined || typeof item.name !== 'string') return false
    return true
}

const isAppDropdownMenuSection = (item) => {
    if (!Array.isArray(item)) return false
    if (item.some((el) => !isAppDropdownMenuSectionItem(el))) return false
    return true
}

export default {
    props: {
        sections: {
            type: Array,
            validator: (value) => (
                !value.some((el) => !isAppDropdownMenuSection(el))
            ),
            required: true
        },
        width: {
            type: Number,
            default: null
        },
        position: {
            type: String,
            default: 'left',
            validator: (value) => {
                const allowed = ['left', 'right']

                return allowed.includes(value)
            }
        }
    },
    data: () => ({
        offsetBottom: 0,
        isVisible: false
    }),
    methods: {
        getOffsetBottom() {
            if (!this.$refs.$list || !this.$refs.$handler.value) return null

            const PADDING_BOTTOM = 20
            const handlerHeight = this.$refs.$handler.value.offsetHeight
            const listHeight = this.$refs.$list.offsetHeight + PADDING_BOTTOM
            const bottomGapHeight = window.innerHeight
                - (this.$refs.$list.getBoundingClientRect().top + listHeight)
            const bottomGapHeightRaw = bottomGapHeight + (this.offsetBottom || 0)

            if (
                bottomGapHeightRaw < 0
                && bottomGapHeightRaw <= -(listHeight - handlerHeight - PADDING_BOTTOM)
            ) {
                return -(listHeight - handlerHeight) + PADDING_BOTTOM
            }

            if (bottomGapHeightRaw < 0) {
                return bottomGapHeightRaw
            }

            return 0
        },
        setOffsetBottom() {
            const offset = this.getOffsetBottom()

            this.offsetBottom = offset
        },
        onItemClick(alias) {
            this.$emit('on-click', alias)
        },
        onToggle() {
            return this.isVisible ? this.onHide() : this.onShow()
        },
        onShow() {
            this.isVisible = true

            Vue.nextTick(() => {
                if (this.$refs.$list === null) return undefined

                this.setOffsetBottom()
                document.addEventListener('scroll', this.setOffsetBottom)

                this.$refs.$list.focus({ preventScroll: true })

                return undefined
            })
        },
        onHide() {
            this.isVisible = false

            document.removeEventListener('scroll', this.setOffsetBottom)
        }
    }
}
</script>

<style lang="scss">
    .app-dropdown-menu {
        display: flex;
        position: relative;

        &__list-positioning-helper {
            display: flex;
            height: 100%;
            position: relative;
            width: 0;
            z-index: 10;

            &--left {
                order: -1;
            }

            &--right {
                order: 1;
            }
        }

        &__list {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 4px 10px 30px rgba(0, 0, 0, .3);
            outline: none;
            padding: px-to-rem(8) px-to-rem(20);
            position: absolute;

            &--left {
                right: px-to-rem(10);
            }

            &--right {
                left: px-to-rem(10);
            }
        }

        &__list-arrow {
            border-bottom: px-to-rem(6) solid transparent;
            border-top: px-to-rem(6) solid transparent;
            height: 0;
            position: absolute;
            top: px-to-rem(10);
            width: 0;
            z-index: 1;

            &--left {
                border-left: px-to-rem(6) solid #fff;
                left: px-to-rem(-10);
            }

            &--right {
                border-right: px-to-rem(6) solid #fff;
                right: px-to-rem(-10);
            }
        }

        &__section {
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            padding: px-to-rem(6) px-to-rem(20) px-to-rem(6) 0;

            &:first-child {
                padding-top: 0;
            }

            &:last-child {
                border: none;
                padding-bottom: 0;
            }
        }

        &__section-item {
            color: #979797;
            cursor: pointer;
            font-size: px-to-rem(14);
            line-height: 1;
            padding: px-to-rem(8) 0;
            position: relative;
            text-decoration: none;
            transition: color .15s ease-in-out;
            white-space: nowrap;

            &:hover {
                color: #333;
            }
        }

        &__section-item-link {
            color: #979797;
        }

        &__handler {
            cursor: pointer;
            display: flex;
            padding: px-to-rem(6) 0;
            z-index: 1;
        }
    }
</style>
