<template>
    <div
        class="app-aclendar"
        @click="onClickElement"
    >
        <div
            class="app-aclendar__input-wrapper"
            @click="openCalendar"
        >
            <slot name="input" :value="formatedValue">
                <input
                    class="app-aclendar__input"
                    type="text"
                    readonly
                    :value="formatedValue"
                />
            </slot>
        </div>
        <div
            v-if="calendarIsOpen"
            class="app-aclendar__wrapper"
        >
            <div class="app-aclendar__header">
                <div
                    class="app-aclendar__previous-month icon-arrow-left"
                    @click="previousMonth"
                />
                <div class="app-aclendar__month">
                    {{ monthAndYear }}
                </div>
                <div
                    class="app-aclendar__next-month icon-arrow-right"
                    @click="nextMonth"
                />
            </div>
            <table class="app-aclendar__body">
                <thead class="app-aclendar__week-days">
                    <tr class="app-aclendar__week-day-names">
                        <td
                            v-for="(name, index) of weekDays"
                            class="app-aclendar__day-of-week-name"
                            :key="index"
                        >
                            {{ name }}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(week, wIndex) of calendar"
                        :key="wIndex"
                        class="app-aclendar__week"
                    >
                        <td
                            v-for="(dayOfWeek, dIndex) of week"
                            :date="dayOfWeek && dayOfWeek.date"
                            :class="{
                                'app-aclendar__day': true,
                                'app-aclendar__day--range': dayOfWeek && dayOfWeek.range,
                                'app-aclendar__day--selected':
                                    dayOfWeek &&
                                    (dayOfWeek.date === begin || dayOfWeek.date === end),
                                'app-aclendar__day--another-month':
                                    dayOfWeek && dayOfWeek.anotherMonth,
                                'app-aclendar__day--today': dayOfWeek && dayOfWeek.date === today,
                                'app-aclendar__day--disabled': dayOfWeek && !dayOfWeek.canBeChosen
                            }"
                            :key="dIndex"
                            @click="dayOfWeek.canBeChosen && selectDate(dayOfWeek.date)"
                        >
                            {{ dayOfWeek.day }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    props: {
        value: {
            type: [String, Object]
        },
        range: {
            type: Boolean,
            default: false
        },
        minDate: {
            type: [String, Date],
            default: undefined
        },
        maxDate: {
            type: [String, Date],
            default: undefined
        }
    },
    data() {
        return {
            weekDays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
            calendarIsOpen: false,
            clickIn: false,
            date: new Date(),
            selectBegin: true,
            begin: '',
            end: ''
        }
    },
    computed: {
        calendar() {
            const weeks = []

            const currentDay = moment(this.date)
                .startOf('month').startOf('day')
            const lastCalendarDay = currentDay.clone().endOf('month').weekday(6)
            const currentMonth = currentDay.clone().month()

            currentDay.weekday(0)

            let weekNumber = 0
            while (currentDay.diff(lastCalendarDay) <= 0) {
                if (!weeks[weekNumber]) {
                    weeks[weekNumber] = []
                }

                weeks[weekNumber].push(this.createDay(
                    currentDay, currentDay.month() !== currentMonth
                ))

                currentDay.add(1, 'day')
                if (currentDay.weekday() === 0) {
                    weekNumber += 1
                }
            }

            return weeks
        },
        monthAndYear() {
            const date = moment(this.date)
            const month = date.format('MMMM')
            return `${month[0].toUpperCase() + month.slice(1)} ${date.get('year')}`
        },
        today() {
            return moment().format('YYYY-MM-DD')
        },
        formatedValue() {
            const dateFormat = 'DD.MM.YYYY'
            if (!this.value || (!this.value.begin && !this.value.end)) {
                return this.range ? 'Выберите даты' : 'Выберите дату'
            }

            if (typeof this.value === 'object') {
                return `${moment(this.value.begin).format(dateFormat)} – ${moment(
                    this.value.end
                ).format(dateFormat)}`
            }

            return moment(this.value).format(dateFormat)
        }
    },
    methods: {
        openCalendar() {
            this.calendarIsOpen = true
        },
        selectDate(date) {
            this.date = new Date(date)

            if (!this.range) {
                this.begin = date
                this.$emit('input', this.begin)
                return
            }

            if (this.selectBegin) {
                this.begin = date
                this.end = undefined
            }

            if (!this.selectBegin) {
                this.end = date
            }

            if (this.begin
                    && this.end
                    && moment(this.begin).diff(this.end) > 0) {
                const buf = this.begin
                this.begin = this.end
                this.end = buf
            }

            if (this.begin
                    && this.end
                    && moment(this.begin).diff(this.end) === 0) {
                return
            }

            this.selectBegin = !this.selectBegin

            this.$emit('input', {
                begin: this.begin,
                end: this.end
            })
        },
        nextMonth() {
            this.date = moment(this.date).add(1, 'month').toDate()
        },
        previousMonth() {
            this.date = moment(this.date).subtract(1, 'month').toDate()
        },
        onClickElement() {
            this.clickIn = true
        },
        onClickOutside() {
            if (this.clickIn) {
                this.clickIn = false
                return undefined
            }

            this.calendarIsOpen = false
            return null
        },
        createDay(momentDate, anotherMonth) {
            const stringDate = momentDate.format('YYYY-MM-DD')
            return {
                day: momentDate.get('date'),
                date: stringDate,
                range: this.begin && this.end
                    ? moment(stringDate).isBetween(this.begin, this.end, undefined, '()')
                    : false,
                anotherMonth,
                canBeChosen: (
                    this.minDate
                        ? momentDate.diff(this.minDate) >= 0
                        : true
                ) && (
                    this.maxDate
                        ? momentDate.diff(this.maxDate) <= 0
                        : true
                )
            }
        }
    },
    created() {
        moment.locale('ru')
        document.addEventListener('click', this.onClickOutside.bind(this))

        if (!this.value) {
            this.date = moment().diff(this.minDate) < 0 ? new Date(this.minDate) : new Date()
            this.date = moment().diff(this.maxDate) > 0 ? new Date(this.maxDate) : new Date()
            return
        }

        const value = typeof this.value === 'object' ? this.value.begin : this.value
        this.date = value
    }
}
</script>

<style lang="scss">
    .app-aclendar {
        display: inline-block;
        position: relative;

        &__input[readonly] {
            cursor: pointer;
            background-color: inherit;
        }

        &__wrapper {
            position: absolute;
            bottom: 0px;
            left: 0px;
            transform: translateY(100%);
            padding: 5px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            border-radius: 5px;
            z-index: 100;
        }

        &__body {
            border-collapse: collapse;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding: 5px;
            box-sizing: border-box;
        }

        &__next-month,
        &__previous-month {
            padding: 5px;
            cursor: pointer;
            box-sizing: border-box;

            &:hover {
                opacity: 0.7;
            }

            &:active {
                opacity: 0.5;
            }
        }

        &__week-day-names {
            text-align: center;
            width: 30px;
            height: 30px;
            border-radius: 4px;
            border: none;
            font-weight: bold;
            text-align: center;
            padding: 5px;
            text-transform: uppercase;
        }

        &__month {
            display: flex;
        }

        &__day {
            text-align: center;
            min-width: 30px;
            height: 30px;
            border-radius: 4px;
            border: none;
            cursor: pointer;

            &--range {
                color: #000;
                background-color: #eee;
                border-color: #bbb;
                border-radius: 0;
            }

            &--selected {
                color: #fff !important;
                background-color: #204d74;
                border-color: #122b40;

                &:hover {
                    border-color: #0c1e2c !important;
                    background-color: #1a4060 !important;
                }
            }

            &--another-month {
                color: #a1a1a1;
            }

            &--today {
                color: red;
            }

            &--disabled {
                pointer-events: none;
                color: lighten(#a1a1a1, 30%);
            }

            &:hover {
                background: #eee;
            }
        }
    }
</style>
