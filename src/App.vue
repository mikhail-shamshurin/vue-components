<template>
    <div id="app">
        <AppSideContent :isOpen="open" position="bottom">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo possimus facilis enim
            laboriosam dolor ipsa maiores amet ipsam fugiat voluptatem numquam voluptates deleniti,
            at assumenda minima culpa accusamus minus ex.
        </AppSideContent>
        <button class="button" @click="toggle">toggle</button>
    </div>
</template>

<script>
    import AppSideContent from './components/AppSideContent.vue'

    export default {
        name: 'App',
        components: {
            AppSideContent
        },
        data: () => ({
            open: false
        }),
        methods: {
            toggle() {
                this.open = !this.open
            }
        }
    }
</script>

<style lang="scss">
    .button {
        position: relative;
        z-index: 1000;
    }
</style>
