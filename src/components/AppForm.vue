<template>
    <div class="form">
        <div class="form__title"></div>
        <div class="form__errors">
            <slot
                name="errors"
                :errors="errors"
            />
        </div>
        <div class="form__body">
            <slot
                v-for="(field, index) of fields"
                class="form__field"
                name="field"
                :field="field"
                :index="index"
            />
        </div>
        <div class="form__buttons">
            <div
                v-for="(button, index) of buttons"
                class="form__button"
                :key="index"
            >
                <slot
                    name="button"
                    :button="button"
                    :index="index"
                />
            </div>
            <div
                class="form__button"
                @click="submit"
            >
                <slot name="submit" />
            </div>
        </div>
    </div>
</template>

<script>
const isField = (field) => {
    if (!field) return false
    if (field.alias || typeof field.alias !== 'string') return false
    if (field.type || typeof field.type !== 'string') return false

    return true
}

const isButton = (button) => {
    if (!button) return false
    if (button.alias || typeof button.alias !== 'string') return false

    return true
}

export default {
    props: {
        fields: {
            type: Array,
            required: true,
            validator: (value) => !value.some((field) => isField(field))
        },
        buttons: {
            type: Array,
            required: true,
            validator: (value) => !value.some((button) => isButton(button))
        },
        rules: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        errors: []
    }),
    methods: {
        submit() {
            try {
                const data = this.fields.reduce((object, field, index) => {
                    const { alias } = field
                    // eslint-disable-next-line no-param-reassign
                    object[alias] = this.fields[index].value
                    return object
                }, {})
                this.$emit('submited', data)
            } catch (error) {
                this.$emit('error', error)
                console.error(error)
            }
        }
    }
}
</script>

<style lang="scss">
.form {
    &__buttons {
        display: flex;
    }
}
</style>
