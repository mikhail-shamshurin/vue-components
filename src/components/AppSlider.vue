<template>
    <div class="slider" ref="slider">
        <div
            class="slider__slides-wrapper"
            @touchend="touchEnd"
            @touchmove="touchMove"
            @touchstart="touchStart"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
            @mouseleave="mouseUp"
        >
            <div
                v-for="(slide, index) of slides"
                :key="index"
                :class="{
                    'slider__slide-wrapper': true,
                    'slider__slide-wrapper--adaptive-size': adaptiveSize
                }"
                :style="slideStyle(index)"
                ref="slide"
            >
                <slot
                    v-bind="{
                        ...slide,
                        ...slideMethods,
                        currentSlide,
                        slides,
                        hasNext,
                        hasPrevious
                    }"
                    :slide-index="index"
                    name="slide"
                />
            </div>
        </div>
        <div class="slider__controls-wrapper">
            <slot
                name="controls"
                v-bind="{
                    ...slideMethods,
                    currentSlide,
                    slides,
                    hasNext,
                    hasPrevious
                }"
            />
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        props: {
            slides: {
                type: Array,
                default: () => []
            },
            looped: {
                type: Boolean,
                default: false
            },
            minX: {
                type: Number,
                default: 50
            },
            minY: {
                type: Number,
                default: 50
            },
            interval: {
                type: Number,
                default: 5000
            },
            vertical: {
                type: Boolean,
                default: false
            },
            adaptiveSize: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            this.startAuto()
            Vue.nextTick(() => {
                this.setSlide(0)
            })
        },
        data: () => ({
            currentSlide: 0,
            pointer: {
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                },
                difference: {
                    x: 0,
                    y: 0
                }
            },
            autoHandler: null,
            isMouseDown: false
        }),
        computed: {
            slidesCount() {
                return this.slides.length
            },
            lastSlideIndex() {
                return this.slidesCount - 1
            },
            isLastSlide() {
                return this.currentSlide === this.slidesCount - 1
            },
            isFirstSlide() {
                return this.currentSlide === 0
            },
            hasNext() {
                return this.looped || !this.isLastSlide
            },
            hasPrevious() {
                return this.looped || !this.isFirstSlide
            },
            slideMethods() {
                return {
                    setActiveSlide: this.setActiveSlide,
                    nextSlide: this.nextSlide,
                    previousSlide: this.previousSlide,
                    startAuto: this.startAuto,
                    stopAuto: this.stopAuto
                }
            }
        },
        methods: {
            setSlide(index) {
                let newIndex = index

                if (this.looped && newIndex < 0) {
                    newIndex = this.lastSlideIndex
                }

                if (this.looped && newIndex > this.lastSlideIndex) {
                    newIndex = 0
                }

                if (!this.looped && newIndex < 0) {
                    newIndex = 0
                }

                if (!this.looped && newIndex > this.lastSlideIndex) {
                    newIndex = this.lastSlideIndex
                }

                this.currentSlide = newIndex

                if (!this.adaptiveSize) return this.currentSlide

                this.$refs.slider.style.height = `${
                    this.$refs.slide[this.currentSlide].scrollHeight
                }px`
                return this.currentSlide
            },
            setActiveSlide(index) {
                this.stopAuto()
                this.setSlide(index)
                this.startAuto()
            },
            slideStyle(index) {
                return {
                    left: `calc(${index * 100 - 100 * this.currentSlide}% - ${
                        this.pointer.difference.x
                    }px)`,
                    transition: this.pointer.difference.x ? 'unset' : undefined
                }
            },
            pressStart(point) {
                this.pointer.start = {
                    x: point.clientX,
                    y: point.clientY
                }
            },
            pressMove(point) {
                this.pointer.end = {
                    x: point.clientX,
                    y: point.clientY
                }

                this.pointer.difference = {
                    x: this.pointer.start.x - this.pointer.end.x,
                    y: this.pointer.start.y - this.pointer.end.y
                }
            },
            pressEnd() {
                const direction = []
                const absolute = {
                    x: Math.abs(this.pointer.difference.x),
                    y: Math.abs(this.pointer.difference.y)
                }

                if (this.pointer.difference.x > 0 && absolute.x > this.minX) {
                    direction.push('left')
                }

                if (this.pointer.difference.x < 0 && absolute.x > this.minX) {
                    direction.push('right')
                }

                if (this.pointer.difference.y > 0 && absolute.y > this.minY) {
                    direction.push('up')
                }

                if (this.pointer.difference.y < 0 && absolute.y > this.minY) {
                    direction.push('down')
                }

                if (!this.vertical && direction.includes('left')) {
                    this.nextSlide()
                }

                if (!this.vertical && direction.includes('right')) {
                    this.previousSlide()
                }

                if (this.vertical && direction.includes('up')) {
                    this.nextSlide()
                }

                if (this.vertical && direction.includes('down')) {
                    this.previousSlide()
                }

                this.pointer = {
                    start: {
                        x: 0,
                        y: 0
                    },
                    end: {
                        x: 0,
                        y: 0
                    },
                    difference: {
                        x: 0,
                        y: 0
                    }
                }
            },
            touchStart(event) {
                this.pressStart(event.touches[0])
            },
            touchMove(event) {
                this.pressMove(event.touches[0])
            },
            touchEnd() {
                this.pressEnd()
            },
            mouseDown(event) {
                this.isMouseDown = true
                this.pressStart(event)
            },
            mouseMove(event) {
                if (!this.isMouseDown) return null
                this.pressMove(event)
                return null
            },
            mouseUp() {
                if (!this.isMouseDown) return null
                this.isMouseDown = false
                this.pressEnd()
                return null
            },
            nextSlide() {
                this.stopAuto()
                this.setSlide(this.currentSlide + 1)
                this.startAuto()
            },
            previousSlide() {
                this.stopAuto()
                this.setSlide(this.currentSlide - 1)
                this.startAuto()
            },
            startAuto() {
                if (this.interval === 0) {
                    return null
                }

                this.autoHandler = setInterval(() => {
                    this.nextSlide()
                }, this.interval)

                return this.autoHandler
            },
            stopAuto() {
                clearInterval(this.autoHandler)
            }
        }
    }
</script>

<style lang="scss">
    .slider {
        transition: height 1s ease 0s;

        &__slides-wrapper {
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        &__slide-wrapper {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            transition: all 0.5s ease 0s;
            overflow: hidden;
            pointer-events: none;

            &--adaptive-size {
                height: unset;
            }
        }

        &__controls-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            pointer-events: none;
        }
    }
</style>
