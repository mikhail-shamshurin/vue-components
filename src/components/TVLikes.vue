<template>
    <likes
        class="tv-like"
        :liked="like"
        :count="likesCount"
        @like="likeVideo"
        @unlike="unlikeVideo"
    >
        <template #like-icon="{ liked }">
            <heart-icon
                :class="{
                    'tv-like__like-icon': true,
                    'tv-like__like-icon--filled': liked
                }"
            />
        </template>
    </likes>
</template>

<script>
import Likes from './Likes.vue'
import HeartIcon from '../assets/heart.svg?component'

export default {
    components: {
        Likes,
        HeartIcon
    },
    props: {
        guid: {
            type: String,
            required: true
        }
    },
    data: () => ({
        likesCount: 0,
        like: false
    }),
    methods: {
        likeVideo() {
            this.like = true
            this.likesCount += 1
        },
        unlikeVideo() {
            this.like = false
            this.likesCount -= 1
        },
        fetchLikeCount() {}
    }
}
</script>

<style lang="scss">
    .tv-like {
        $blue: #0ca9ef;
        $gray: #979797;

        &__like-icon {
            cursor: pointer;

            .heart__fill {
                fill: transparent;
                transition: all .25s ease 0s
            }

            .heart__stroke {
                fill: $gray;
                transition: all .25s ease 0s
            }

            &--filled {
                .heart__fill, .heart__stroke {
                    fill: $blue;
                }
            }

            &:hover {
                .heart__stroke {
                    fill: $blue;
                }
            }

            &:active {
                .heart__stroke {
                    transition-duration: 0s;
                    fill: lighten($blue, 10%);
                }
            }
        }

        .like__count-wrapper {
            color: $gray
        }
    }
</style>
