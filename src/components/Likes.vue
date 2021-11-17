<template>
    <div class="like">
        <div
            class="like__icon-wrapper"
            @click="toggleLike"
        >
            <slot
                name="like-icon"
                :liked="liked"
            />
        </div>
        <div class="like__count-wrapper">
            {{ count }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        liked: {
            type: Boolean,
            default: false
        },
        count: {
            type: Number,
            default: 0
        }
    },
    methods: {
        toggleLike(event) {
            if (!this.liked) {
                this.like(event)
                return
            }

            this.unlike(event)
        },
        like(event) {
            this.$emit('like', event)
        },
        unlike(event) {
            this.$emit('unlike', event)
        }
    }
}
</script>

<style lang="scss">
    .like {
        display: flex;
        align-items: center;

        &__icon-wrapper {
            flex-shrink: 0;
            width: 24px;
            height: 20px;
        }

        &__count-wrapper {
            font-family: PT Sans, Arial, Helvetica, sans-serif;
            font-weight: bold;
            font-size: 16px;
            line-height: 1.1;
            margin-left: 6px;
            user-select: none;
        }
    }
</style>
