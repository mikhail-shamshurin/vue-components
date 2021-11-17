<template>
    <app-slider :slides="slides" adaptiveSize looped>
        <template #slide="{ slideIndex }">
            {{ slideIndex }}
        </template>
    </app-slider>
</template>

<script>
    import AppSlider from './components/AppSlider.vue'

    export default {
        components: {
            AppSlider
        },
        data: () => ({
            slides: [
                {
                    alias: 'alias1'
                },
                {
                    alias: 'alias2'
                },
                {
                    alias: 'alias3'
                }
            ]
        })
    }
</script>

<style></style>
