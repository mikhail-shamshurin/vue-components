<template>
    <div class="comments">
        <comment-input
            auto-resize
            ref="comment-field"
            class="comments__comment-field"
            placeholder="Ваш комментарий"
            :disabled="commentLocked"
            @submit="postComment"
        />
        <div class="comments__comments-wrapper">
            <expand-transition-group class="oleg">
                <comment
                    ref="comment"
                    v-bind="comment"
                    v-for="(comment, index) in comments"
                    class="comments__comment"
                    :canRemove="comment.isCanremove"
                    :canReport="!comment.isCanremove"
                    :key="index"
                    @cancel-report="cancelReport"
                    @remove="removeComment"
                    @report="reportComment"
                    @toggle-response-field="focusOnResponseField"
                >
                    <template #text>{{ comment.text }}</template>
                    <template #response-field="{ firstname, toggleMethod }">
                        <comment-input
                            auto-resize
                            closable
                            class="comment__response-field"
                            placeholder="Ваш комментарий"
                            ref="response-field"
                            :avatar="comment.avatarUrl"
                            :disabled="responseLocked"
                            @submit="(text) => postResponse(text, comment.id, index)"
                            @close="toggleMethod"
                        >{{ firstname }}, </comment-input>
                    </template>
                    <template #response="{ response }">
                        <comment
                            response
                            v-bind="response"
                            :canRemove="comment.isCanremove"
                            :canReport="!comment.isCanremove"
                            @remove="removeResponse"
                            @report="reportResponse"
                            @cancel-report="cancelReport"
                        >
                            <template #text>{{ response.text }}</template>
                        </comment>
                    </template>
                </comment>
            </expand-transition-group>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Comment from './TVComment.vue'
import CommentInput from './TVCommentInput.vue'
import ExpandTransitionGroup from '../ExpandTransitionGroup.vue'

export default {
    /* eslint-disable no-console */
    props: {
        guid: {
            type: String,
            required: true
        }
    },
    components: {
        Comment,
        CommentInput,
        ExpandTransitionGroup
    },
    data() {
        return {
            comments: [
                {
                    webCastId: '59dcdc86-1ef0-4e3f-8b2e-b849e65b3f20',
                    id: 9,
                    userId: 3323387,
                    userFullName: 'Михаил Шамшурин',
                    parentId: null,
                    dateCreated: '2021-05-11T19:15:19.48',
                    text: 'Тестовый комментарий',
                    avatarUrl: 'http://www.workle.ru/storage/84/cb/fd/74/a9/90/17/93/4ad5-c12cab-ea846e.jpg',
                    childComments: [
                        {
                            webCastId: '59dcdc86-1ef0-4e3f-8b2e-b849e65b3f20',
                            id: 10,
                            userId: 3323387,
                            userFullName: 'Михаил Шамшурин',
                            parentId: 9,
                            dateCreated: '2021-05-11T19:30:09.993',
                            text: 'Тестовый ответ',
                            avatarUrl: 'http://www.workle.ru/storage/84/cb/fd/74/a9/90/17/93/4ad5-c12cab-ea846e.jpg',
                            childComments: null,
                            isCanDelete: false
                        }
                    ],
                    isCanDelete: false
                },
                {
                    webCastId: '59dcdc86-1ef0-4e3f-8b2e-b849e65b3f20',
                    id: 11,
                    userId: 3323387,
                    userFullName: 'Михаил Шамшурин',
                    parentId: null,
                    dateCreated: '2021-05-12T23:29:08.773',
                    text: 'Комментарий о том, как хорошо живется в Матушке-Россие',
                    avatarUrl: 'http://www.workle.ru/storage/84/cb/fd/74/a9/90/17/93/4ad5-c12cab-ea846e.jpg',
                    childComments: [],
                    isCanDelete: false
                }
            ],
            responseLocked: false,
            commentLocked: false
        }
    },
    computed: {
        $commentField() {
            return this.$refs['comment-field']
        },
        $responseFields() {
            return this.$refs['response-field']
        }
    },
    methods: {
        removeComment() {
            console.log('removeComment')
        },
        reportComment() {
            console.log('reportComment')
        },
        focusOnResponseField(open) {
            if (!open) return

            Vue.nextTick(() => {
                if (this.$responseField === undefined) return

                this.$responseField.focus()
            })
        },
        async postResponse(text, id, commentIndex) {
            try {
                this.responseLocked = true
                await this.delay(3000)
                console.log('postResponse', { text, id })

                const field = this.$responseFields[commentIndex]
                field.clear()
                field.close()
            } catch (error) {
                console.warn(error)
            } finally {
                this.responseLocked = false
            }
        },
        async postComment(text) {
            try {
                this.commentLocked = true
                await this.delay(3000)
                console.log('postComment', { text })
                const comment = { ...this.comments[0] }
                comment.id += 1
                this.comments = Array.from([...this.comments, comment])
                this.$commentField.clear()
            } catch (error) {
                console.warn(error)
            } finally {
                this.commentLocked = false
            }
        },
        removeResponse() {
            console.log('removeResponse')
        },
        reportResponse() {
            console.log('reportResponse')
        },
        cancelReport() {
            console.log('cancelReport')
        },
        toggleResponseField() {
        },

        // ! Testing methods ! //

        async delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms))
        }
    }
}
</script>

<style lang="scss">
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow-x: hidden;
}

.comments {
    &__comment {
        max-width: 600px;
        flex-shrink: 0;
        min-width: 600px;
    }

    &__comment-field {
        min-width: 600px;
    }

    &__comments-wrapper {
        margin-top: 20px;
    }
}
</style>
