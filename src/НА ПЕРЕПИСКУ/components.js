const main = () => {
    const LinkIcon = Vue.extend({
        template: `
            <svg
                class="link-icon"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class="link-icon__circle"
                    cx="15"
                    cy="15"
                    r="15"
                />
                <path
                    class="link-icon__link"
                    d="M12.5139 14.5021C13.3106 13.7054 14.7001 13.7054 15.4968 14.5021L15.9939 14.9993L16.9882 14.005L16.4911 13.5078C15.828 12.844 14.9448 12.4777 14.0053 12.4777C13.0659 12.4777 12.1827 12.844 11.5196 13.5078L10.0274 14.9993C9.36947 15.6594 9 16.5534 9 17.4854C9 18.4174 9.36947 19.3114 10.0274 19.9715C10.3536 20.2981 10.7411 20.5571 11.1677 20.7335C11.5943 20.9099 12.0516 21.0003 12.5132 20.9995C12.9749 21.0005 13.4323 20.9101 13.859 20.7337C14.2857 20.5573 14.6734 20.2982 14.9996 19.9715L15.4968 19.4743L14.5025 18.48L14.0053 18.9772C13.6091 19.3716 13.0727 19.5931 12.5135 19.5931C11.9544 19.5931 11.418 19.3716 11.0217 18.9772C10.6269 18.5811 10.4052 18.0446 10.4052 17.4854C10.4052 16.9261 10.6269 16.3896 11.0217 15.9936L12.5139 14.5021Z"
                />
                <path
                    class="link-icon__link"
                    d="M14.9996 10.028L14.5025 10.5252L15.4968 11.5195L15.9939 11.0223C16.3902 10.6278 16.9266 10.4063 17.4857 10.4063C18.0449 10.4063 18.5813 10.6278 18.9775 11.0223C19.3724 11.4184 19.5941 11.9548 19.5941 12.5141C19.5941 13.0734 19.3724 13.6098 18.9775 14.0059L17.4854 15.4974C16.6887 16.2941 15.2992 16.2941 14.5025 15.4974L14.0053 15.0002L13.011 15.9945L13.5082 16.4916C14.1713 17.1554 15.0545 17.5218 15.9939 17.5218C16.9334 17.5218 17.8166 17.1554 18.4797 16.4916L19.9718 15.0002C20.6298 14.3401 20.9993 13.4461 20.9993 12.5141C20.9993 11.5821 20.6298 10.6881 19.9718 10.028C19.3119 9.3697 18.4179 9 17.4857 9C16.5536 9 15.6595 9.3697 14.9996 10.028Z"
                />
            </svg>
        `
    })

    const ArrowIcon = Vue.extend({
        template: `
            <svg
                viewBox="0 0 12 7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M1.41 0L6 4.32659L10.59 0L12 1.33198L6 7L0 1.33198L1.41 0Z" />
            </svg>

        `
    })

    const AppButton = Vue.extend({
        template: `
           <component
               :href="href"
               :is="componentType"
               v-bind="$attrs"
               class="app-button"
           >
                <slot />
            </component>
        `,
        props: {
            href: {
                type: String,
                default: ''
            }
        },
        computed: {
            componentType() {
                if (this.href) return 'a'

                return 'button'
            }
        }
    })

    const AppCopy = Vue.extend({
        template: `
            <transition-group
                v-bind="$attrs"
                :name="name"
                tag="div"
                class="app-copy"
            >
                <div
                    class="app-copy__handler-wrapper"
                    key="handler"
                    @click="copy"
                >
                    <slot />
                </div>
                <div
                    v-if="isOpen"
                    key="content"
                    class="app-copy__caption-wrapper"
                >
                    <slot name="caption"/>
                </div>
            </transition-group>
        `,
        props: {
            copyContent: {
                type: String,
                default: ''
            },
            timeout: {
                type: Number,
                default: 3000
            },
            name: {
                type: String,
                default: 'popup'
            }
        },
        data: () => ({
            timeoutHandler: null,
            isOpen: false
        }),
        methods: {
            open() {
                this.isOpen = true
            },
            close() {
                this.isOpen = false
            },
            toggle() {
                if (this.isOpen) return this.close()

                return this.open()
            },
            async copy() {
                if (this.isOpen) return undefined

                try {
                    await navigator.clipboard.writeText(this.copyContent)

                    this.open()
                    timeoutHandler = setTimeout(() => {
                        this.close()
                    }, this.timeout)
                } catch (err) {
                    console.log(err)
                }
            }
        }
    })

    const AppLink = Vue.extend({
        template: `
            <app-copy
                class="app-link"
                :copy-content="link"
            >
                <div class="app-link__content">
                    <div class="app-link__icon-wrapper">
                        <slot name="link">
                            <link-icon class="app-link__default-icon" />
                        </slot>
                    </div>
                    <div class="app-link__text-wrapper">
                        <slot />
                    </div>
                </div>
                <div
                    slot="caption"
                    class="app-link__message"
                >
                    Скопировано!
                </div>
            </app-copy>
        `,
        components: {
            LinkIcon,
            AppCopy
        },
        props: {
            link: {
                type: String,
                default: ''
            }
        }
    })

    const AppSideContent = Vue.extend({
        template: `
            <div
                :class="{
                    'app-side-content': true,
                    ['app-side-content--' + position]: true,
                    'app-side-content--open': isOpen
                }"
            >
                <slot />
            </div>
        `,
        props: {
            isOpen: {
                type: Boolean,
                default: false
            },
            position: {
                type: String,
                default: 'top',
                validator: (value) => {
                    const allowed = ['top', 'left', 'bottom', 'right']

                    if (!allowed.includes(value)) {
                        console.error(
                            '[Vue: warn] <AppSideContent>: position prop must be one of ' +
                                allowed.join(', ')
                        )

                        return false
                    }

                    return true
                }
            }
        }
    })

    const RealtyHowCard = Vue.extend({
        template: `
            <div class="realty-how-card">
                <img
                    class="realty-how-card__image"
                    :src='image'
                >
                <div
                    v-html="title"
                    class="realty-how-card__title"
                />
                <div
                    v-html="text"
                    class="realty-how-card__text"
                />
            </div>
        `,
        props: {
            image: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            text: {
                type: String,
                default: ''
            }
        }
    })

    const RealtyLearnCard = Vue.extend({
        template: `
            <div class="realty-learn-card">
                <div class="realty-learn-card__background">
                    <img
                        class="realty-learn-card__image"
                        :src="image"
                    >
                </div>
                <div class="realty-learn-card__bottom-wrapper">
                    <div
                        v-html="title"
                        class="realty-learn-card__title"
                    />
                    <app-button
                        :href="link"
                        class="realty-learn-card__button"
                        target="_blank"
                    >
                        Узнать
                    </app-button>
                </div>
            </div>
        `,
        components: {
            AppButton
        },
        props: {
            image: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            link: {
                type: String,
                default: ''
            }
        }
    })

    const AppExpandTransition = Vue.extend({
        template: `
           <component
               :is="componentType"
               v-bind="$attrs"
               name="expand"
               @enter="enter"
               @afterEnter="afterEnter"
               @leave="leave"
           >
                <slot />
            </component>
        `,
        props: {
            group: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            enter(element) {
                const width = element.getBoundingClientRect().width

                element.style.width = width
                element.style.position = 'absolute'
                element.style.visibility = 'hidden'
                element.style.height = 'auto'

                const height = element.getBoundingClientRect().height

                element.style.width = ''
                element.style.position = ''
                element.style.visibility = ''
                element.style.height = '0px'

                window.requestAnimationFrame(() => {
                    element.style.height = height + 'px'
                })
            },
            afterEnter(element) {
                element.style.height = 'auto'
            },
            leave(element) {
                const height = element.getBoundingClientRect().height

                element.style.height = height + 'px'

                window.requestAnimationFrame(() => {
                    element.style.height = '0px'
                })
            }
        },
        computed: {
            componentType() {
                return this.group ? 'transition-group' : 'transition'
            }
        }
    })

    const AppSpoiler = Vue.extend({
        template: `
            <div
                class="app-spoiler"
                @click="toggle"
            >
                <div
                    class="app-spoiler__header-wrapper"
                >
                    <slot
                        v-bind="{
                            isOpen,
                            toggle
                        }"
                        name="header"
                    />
                </div>
                <app-expand-transition>
                    <div
                        v-if="isOpen"
                        class="app-spoiler__header-wrapper"
                    >
                        <slot
                            v-bind="{
                                isOpen,
                                toggle
                            }"
                        />
                    </div>
                </app-expand-transition>
            </div>
        `,
        components: {
            AppExpandTransition
        },
        props: {
            initialOpen: {
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            isOpen: false
        }),
        methods: {
            open() {
                this.isOpen = true
            },
            close() {
                this.isOpen = false
            },
            toggle() {
                return this.isOpen ? this.close() : this.open()
            }
        }
    })

    const RealtySpoiler = Vue.extend({
        template: `
            <app-spoiler
                ref="spoiler"
                v-bind="$attrs"
                :class="{
                    'realty-spoiler': true,
                    'realty-spoiler--open': isOpen
                }"
            >
                <div
                    slot="header"
                    slot-scope="spoiler"
                    class="realty-spoiler__header"
                >
                    <span v-html="title" />
                    <arrow-icon class="realty-spoiler__icon" />
                </div>
                <div
                    slot-scope="spoiler"
                    class="realty-spoiler__content"
                >
                    <span v-html="content" />
                </div>
            </app-spoiler>
        `,
        components: {
            AppSpoiler,
            ArrowIcon
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            content: {
                type: String,
                default: ''
            }
        },
        data: () => ({
            isOpen: false
        }),
        mounted() {
            this.$watch(
                () => this.$refs.spoiler.isOpen,
                (value) => (this.isOpen = value)
            )
        }
    })

    const AppBurger = Vue.extend({
        template: `
            <div
                :class="{
                    'app-burger': true,
                    'app-burger--open': isOpen
                }"
            >   
                <div class="app-burger__line-wrapper">
                    <div class="app-burger__line" />
                    <div class="app-burger__line" />
                    <div class="app-burger__line" />
                </div>
            </div>
        `,
        props: {
            isOpen: {
                type: Boolean,
                default: false
            }
        }
    })

    const WorkleHeader = Vue.extend({
        template: `
            <div class="workle-header">
                <div class="workle-header__content-wrapper">
                    <img
                        class="workle-header__logo"
                        :src="logo"
                    >
                    <div class="workle-header__menu">
                        <a
                            v-for="(item, index) of menuItems"
                            :key="index"
                            :href="item.href"
                            v-html="item.text"
                            class="workle-header__menu-item"
                       />
                    </div>
                    <app-burger
                        class="workle-header__menu-button"
                        :is-open="menuIsOpen"
                        @click.native="toggle"
                    />
                </div>
                <app-side-content
                    class="workle-header__mobile-menu"
                    :is-open="menuIsOpen"
                >
                    <div class="mobile-menu">
                        <app-burger
                            class="mobile-menu__menu-button"
                            :is-open="menuIsOpen"
                            @click.native="toggle"
                        />
                        <a
                            :href="item.href"
                            v-for="(item, index) of menuItems"
                            :key="index"
                            v-html="item.text"
                            class="mobile-menu__item"
                            @click="close"
                        />
                    </div>
                </app-side-content>
            </div>
        `,
        components: {
            AppSideContent,
            AppBurger
        },
        props: {
            logo: {
                type: String,
                default:
                    'https://www.workle.ru/s3storage/commonfiles/25264936-fdbb-4afa-96ed-a5810d8b41bc.svg#logo'
            },
            menuItems: {
                type: Array,
                default: () => []
            }
        },
        data: () => ({
            menuIsOpen: false
        }),
        methods: {
            close() {
                this.menuIsOpen = false
            },
            open() {
                this.menuIsOpen = true
            },
            toggle() {
                return this.menuIsOpen ? this.close() : this.open()
            }
        }
    })

    const WorkleFooter = Vue.extend({
        template: `
            <div class="workle-footer">
                <div class="workle-footer__resident-wrapper">
                    <img
                        class="workle-footer__skolkovo"
                        src="https://www.workle.ru/s3storage/commonfiles/e5ee3817-db3a-40a1-85b2-e421fd053150.svg#Skolkovo"
                    >
                    <div class="workle-footer__resident">
                        Резидент инновационного центра &laquo;Сколково&raquo;
                    </div>
                </div>
                <div class="workle-footer__rights">
                    &copy; 2011&ndash;{{
                        year
                    }}. <br>
                    Workle&nbsp;&mdash; официальная интернет-работа
                </div>
            </div>
        `,
        computed: {
            year: () => new Date().getFullYear()
        }
    })

    return new Vue({
        el: '.app',
        components: {
            AppButton,
            AppLink,
            RealtyHowCard,
            RealtyLearnCard,
            RealtySpoiler,
            WorkleHeader,
            WorkleFooter
        },
        data: () => ({
            clientLink: 'https://www.workle.ru/id{UserId}/promopage/workle-realty',
            howItems: [
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/796059f1-a5c4-47f6-8e23-6a38e76302e6.svg#icon',
                    title: 'Поиск клиента',
                    text: 'Найдите клиента, который хочет купить квартиру в&nbsp;новостройке, определите его потребности'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/68753775-a507-412b-8774-3c7272188153.svg#icon-1',
                    title: 'Подбор объекта',
                    text: 'Подберите новостройки из&nbsp;каталога Workle Pro в&nbsp;соответствии с&nbsp;запросами клиента'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/3a357f95-f795-439c-915b-01fe82f59583.svg#icon-2',
                    title: 'Запрос на уникальность клиента',
                    text: 'Сделайте запрос на&nbsp;уникальность&nbsp;&mdash; зафиксируйте клиента за&nbsp;собой'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/512594b0-ac9a-4a50-a5fa-035bd33ba876.svg#icon-3',
                    title: 'Подтверждение уникальности',
                    text: 'В&nbsp;течение 12 часов сотрудник Workle Pro подтвердит уникальности и&nbsp;закрепит клиента за&nbsp;вами'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/174ef3af-4272-44cf-8d57-68f80c62f6c6.svg#icon-4',
                    title: 'Сопровождение клиента на объект',
                    text: 'Выберите 3&ndash;5 объектов, проведите показы клиенту, подпишите акты просмотров'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/ed396690-f420-454d-aec2-bedc9dd0ab0a.svg#icon-5',
                    title: 'Бронирование квартиры',
                    text: 'Забронируйте выбранные объекты у&nbsp;застройщиков'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/d7a1c7f0-66f7-4f7c-82c0-4b8002663026.svg#icon-6',
                    title: 'Сделка',
                    text: 'Подпишите/зарегистрируйте договор, дождитесь поступления средств к&nbsp;застройщику'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/789c45fa-dc64-4b5e-95e7-cebba2d0b117.svg#icon-7',
                    title: 'Отправка документов',
                    text: 'Пришлите подтверждающие документы в&nbsp;Workle Pro для выплаты комиссионных'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/f480510d-1d3e-497c-bf69-81b7280d0cfa.svg#icon-8',
                    title: 'Начисление комиссионных',
                    text: 'Получите вознаграждение за&nbsp;сделку'
                }
            ],
            learnItems: [
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/52149686-5d2b-422a-982c-a57d9039e31c.svg#people',
                    title: 'Как стать риэлтором с&nbsp;нуля',
                    link: 'https://www.workle.ru/'
                },
                {
                    image: 'https://www.workle.ru/s3storage/commonfiles/52149686-5d2b-422a-982c-a57d9039e31c.svg#people',
                    title: 'Продажа недвижимости на&nbsp;Workle Pro: от&nbsp;&laquo;А&raquo; до&nbsp;&laquo;Я&raquo;',
                    link: 'https://www.workle.ru/'
                }
            ],
            questionItems: [
                {
                    title: 'Вопрос №1',
                    content: 'Ответ №1'
                },
                {
                    title: 'Вопрос №2',
                    content: 'Ответ №2'
                },
                {
                    title: 'Вопрос №3',
                    content: 'Ответ №3'
                }
            ],
            menuItems: [
                {
                    text: 'Как всё работает',
                    href: '#how'
                },
                {
                    text: 'Обучение',
                    href: '#learn'
                },
                {
                    text: 'Вопросы и ответы',
                    href: '#faq'
                }
            ]
        })
    })
}