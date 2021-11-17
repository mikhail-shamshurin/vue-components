<template>
    <div class="app-switch">
        <div
            v-for="(option, index) of options"
            :key="index"
            class="app-switch__option"
        >
            <slot
                v-bind="option"
                name="option"
            >
                {{ option }}
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        }
    }
}
</script>

<style></style>
