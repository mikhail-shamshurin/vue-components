<template>
    <div
        :class="{
            'comment': true,
            'comment--response': response
        }"
    >
        <div class="comment__head">
            <div class="comment__author">
                <img
                    class="comment__avatar"
                    :src="avatarUrl"
                >
                <div class="comment__author-text-wrapper">
                    <div class="comment__userName">
                    {{ userFullName }}
                </div>
                <div class="comment__date">
                    {{ timeFromNow }}
                </div>
                </div>
            </div>
            <div class="comment__actions">
                <template v-if="reported">
                    <div class="comment__reported">
                        <alert-icon class="comment__alert-icon comment__alert-icon--red"/>
                        Отмечен как спам
                    </div>
                    <div
                        class="comment__action comment__action--report"
                        v-if="reported"
                        @click="onCancelReport"
                    >
                        Отмена
                    </div>
                </template>
                <div
                    class="comment__action comment__action--report"
                    v-if="canReport && !reported"
                    @click="onReport"
                >
                    Пожаловаться
                </div>
                <div
                    v-if="canRemove"
                    class="comment__action comment__action--remove"
                    @click="onRemove"
                >
                    Удалить
                </div>
            </div>
        </div>
        <div class="comment__body">
            <div class="comment__text">
                <slot name="text" />
            </div>
            <div class="comment__actions">
                <div
                    v-if="childComments !== undefined && !response"
                    class="comment__action comment__action--toggle-response-field"
                    @click="toggleResponseField"
                >
                    {{ toggleResponseFieldCaption }}
                </div>
            </div>
            <expand-transition>
                <div
                    v-if="responseFieldOpen
                        && childComments !== undefined
                        && !response"
                    class="comment__response-field-wrapper"
                >
                    <slot
                        name="response-field"
                        :firstname="firstname"
                        :toggleMethod="toggleResponseField"
                    />
                </div>
            </expand-transition>
            <div
                v-if="childComments && responsesCount !== 0 && !response"
                class="comment__responses"
            >
                <div
                    class="
                        comment__action
                        comment__action--toggle-responses
                    "
                    @click="toggleResponses"
                >
                   <triangle-icon
                        :class="{
                            'comment__collapse-icon': true,
                            'comment__collapse-icon--blue': true,
                            'comment__collapse-icon--upside-down': responsesOpen
                        }"
                    />
                    {{ toggleResponsesCaption }}
                </div>
                <expand-transition>
                    <div
                        v-show="responsesOpen"
                        class="comment__responses-list"
                    >
                        <slot
                            v-for="(response, index) in childComments"
                            name="response"
                            :index="index"
                            :response="response"
                        ></slot>
                    </div>
                </expand-transition>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import TriangleIcon from '../../assets/triangle-arrow.svg?component'
import AlertIcon from '../../assets/alert.svg?component'
import ExpandTransition from '../ExpandTransition.vue'

export default {
    components: {
        TriangleIcon,
        AlertIcon,
        ExpandTransition
    },
    props: {
        childComments: {
            type: Array,
            required: false
        },
        response: {
            type: Boolean,
            default: false
        },
        id: {
            type: Number,
            required: true
        },
        dateCreated: {
            type: [String, Date],
            required: true
        },
        userFullName: {
            type: String,
            required: true
        },
        avatarUrl: {
            type: String,
            required: true
        },
        canRemove: {
            type: Boolean,
            default: false
        },
        canReport: {
            type: Boolean,
            default: false
        },
        reported: {
            type: Boolean,
            default: false
        }
    },
    filters: {
        declination(number, words) {
            // eslint-disable-next-line no-param-reassign
            number = Math.abs(number) % 100
            const lastDigit = number % 10

            if ((number >= 10 && number <= 19) || (lastDigit >= 5 && lastDigit <= 9)) return `${number} ${words[1]}`
            if (lastDigit === 1) return `${number} ${words[0]}`
            if (lastDigit >= 2 && lastDigit <= 4) return `${number} ${words[2]}`

            return `${number} ${words[1]}`
        },
        showOrHide(bool) {
            return !bool ? 'Показать' : 'Скрыть'
        }
    },
    data: () => ({
        responseFieldOpen: false,
        responsesOpen: false
    }),
    computed: {
        filters() {
            return this.$options.filters
        },
        toggleResponsesCaption() {
            const response = this.filters.declination(
                this.responsesCount,
                ['ответ', 'ответов', 'ответа']
            )
            const showOrHide = this.filters.showOrHide(this.responsesOpen)
            return `${showOrHide} ${response}`
        },
        toggleResponseFieldCaption() {
            return !this.responseFieldOpen ? 'Ответить' : 'Отмена'
        },
        timeFromNow() {
            return moment(this.dateCreated).fromNow()
        },
        responsesCount() {
            return this.childComments ? this.childComments.length : 0
        },
        firstname() {
            if (this.userFullName && this.userFullName.length) {
                return this.userFullName.split(' ')[0]
            }

            return ''
        }
    },
    methods: {
        toggleResponseField() {
            this.responseFieldOpen = !this.responseFieldOpen
            this.$emit('toggle-response-field', this.responseFieldOpen)
        },
        toggleResponses() {
            this.responsesOpen = !this.responsesOpen
            this.$emit('toggle-reposnses', this.responsesOpen)
        },
        onResponse(text) {
            this.$emit('response', text)
        },
        onInput(event) {
            this.responseText = event.target.value
        },
        onRemove(event) {
            this.$emit('remove', event)
        },
        onReport(event) {
            this.$emit('report', event)
        },
        onCancelReport(event) {
            this.$emit('cancel-report', event)
        }
    },
    created() {
        moment.locale('ru')
    }
}
</script>

<style lang="scss">
    $blue: #0CA9EF;
    $red: #FF2C2C;
    $gray: #979797;

    @mixin color($color, $transition: all .25s ease 0s) {
        color: $color;
        transition: $transition;

        &:hover {
            color: lighten($color, 20%)
        }

        &:active {
            transition: none;
            color: lighten($color, 10%)
        }
    }

    @mixin littleText {
        font-size: 12px;
        line-height: 1.25;
    }

    .comment {
        margin-top: 20px;
        font-family: "PT Sans", Arial, Helvetica, sans-serif;
        font-style: normal;
        font-size: 16px;
        line-height: 1.3;
        letter-spacing: 0.02em;
        color: #333333;
        box-sizing: border-box;

        &:first-child {
            margin-top: 0px;
        }

        * {
            box-sizing: border-box;
        }

        &__alert-icon {
            margin-right: 4px;

            &--red {
                .alert__circle {
                    stroke: $red;
                }

                .alert__exclamation-mark-dot,
                .alert__exclamation-mark-line {
                    fill: $red;
                }
            }

            &--blue {
                .alert__circle {
                    stroke: $blue;
                }

                .alert__exclamation-mark-dot,
                .alert__exclamation-mark-line {
                    fill: $blue
                }
            }

            &--gray {
                .alert__circle {
                    stroke: $gray;
                }

                .alert__exclamation-mark-dot,
                .alert__exclamation-mark-line {
                    fill: $gray;
                }
            }
        }

        &__collapse-icon {
            transform: rotate(180deg);
            transition: transform .25s ease 0s;
            margin-right: 5px;

            &--upside-down {
                transform: rotate(0deg);
            }

            &--blue {
                fill: $blue;
            }

            &--red {
                fill: $red;
            }

            &--gray {
                fill: $gray;
            }
        }

        &__actions {
            display: flex;
            align-items: baseline;
        }

        &__reported {
            display: flex;
            align-items: baseline;
            @include littleText;
            color: $red;
        }

        &__action {
            display: flex;
            margin-left: 10px;
            cursor: pointer;
            user-select: none;
            @include littleText;

            &:first-child {
                margin-left: 0px;
            }

            &--toggle-response-field {
                @include color($gray);
                margin-top: 10px;
            }

            &--remove {
                @include color($red);
            }

            &--toggle-responses {
                @include color($blue);
                display: flex;
                align-items: baseline;
                margin-top: 9px;
            }

            &--report {
                @include color($gray);
                cursor: pointer;
            }
        }

        &__head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &__author {
            display: flex;
            align-items: center;
        }

        &__avatar {
            display: block;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            place-content: cover;
        }

        &__author-text-wrapper {
            display: flex;
            align-items: baseline;
        }

        &__userName {
            font-weight: bold;
            margin-left: 10px;
        }

        &__date {
            @include littleText;
            color: $gray;
            margin-left: 10px;
        }

        &__body {
            padding-left: 42px;
        }

        &__text {
            margin-top: 7px;
        }

        &__response-field-wrapper {
            margin-top: 16px;
            position: relative;
        }

        &__responses-list {
            margin-top: 20px;
        }
    }
</style>
