<template>
    <transition
        name="expand"
        @after-enter="afterEnter"
        @enter="enter"
        @leave="leave"
    >
        <slot />
    </transition>
</template>

<script>
export default {
    name: 'TransitionExpand',
    methods: {
        enter(element) {
            const { width } = getComputedStyle(element)
            const target = element

            target.style.width = width
            target.style.position = 'absolute'
            target.style.visibility = 'hidden'
            target.style.height = 'auto'

            const { height } = getComputedStyle(element)

            target.style.width = null
            target.style.position = null
            target.style.visibility = null
            target.style.height = 0
            window.requestAnimationFrame(() => {
                target.style.height = height
            })
        },
        afterEnter(element) {
            const target = element

            target.style.height = 'auto'
        },
        leave(element) {
            const { height } = window.getComputedStyle(element)
            const target = element

            target.style.height = height

            window.requestAnimationFrame(() => {
                target.style.height = 0
            })
        }
    }
}
</script>

<style lang="scss">
    .expand-enter-active,
    .expand-leave-active {
        transition: height 0.25s ease 0s;
        overflow: hidden;
    }

    .expand-enter,
    .expand-leave-to {
        height: 0;
    }
</style>
