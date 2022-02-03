<template>
    <div
        :class="{
            'app-side-content': true,
            ['app-side-content--' + position]: true,
            'app-side-content--open': isOpen
        }"
    >
        <slot />
    </div>
</template>

<script>
    export default {
        props: {
            isOpen: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: 'top',
                validator: (value) => {
                    const allowed = ['top', 'left', 'bottom', 'right']

                    if (!allowed.includes(value)) {
                        console.error(
                            '[Vue: warn] <AppSideContent>: position prop must be one of ' +
                                allowed.join(', ')
                        )

                        return false
                    }

                    return true
                }
            }
        }
    }
</script>

<style lang="scss">
    .app-side-content {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        transition: all 0.3s ease;

        &--left {
            transform: translate(-100%, 0);
        }

        &--top {
            transform: translate(0, -100%);
        }

        &--right {
            transform: translate(100%, 0);
        }

        &--bottom {
            top: unset;
            bottom: 0px;
            transform: translate(0, 100%);
        }

        &--open {
            transform: translate(0, 0);
        }
    }
</style>
