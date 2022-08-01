<template>
    <div id="app">
        <input type="text" v-model="field.value" v-for="(field, index) of fields" :key="index" />
        <button @click="addField">Добавить поле</button>
    </div>
</template>

<script>

    export default {
        data: () => ({
            fields: [],
            field: {
                value: ''
            }
        }),
        methods: {
            addField() {
                const copy = JSON.parse(JSON.stringify(this.field))
                this.fields.push(copy)
            }
        }
    }
</script>

<style lang="scss"></style>
