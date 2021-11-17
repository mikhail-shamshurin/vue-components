<template>
    <div class="calendar">
        <div class="calendar__header">
            <div class="calendar__date">
                {{ selectedMonthYearString }}
            </div>
            <div class="calendar__controls">
                <div
                    class="calendar__controls-button"
                    @click="previous()"
                >
                    <arrow-icon class="calendar__controls-icon calendar__controls-icon--left" />
                </div>
                <div
                    class="calendar__controls-button"
                    @click="next()"
                >
                    <arrow-icon class="calendar__controls-icon" />
                </div>
            </div>
        </div>
        <div class="calendar__days">
            <div
                v-for="(item, index) in weekDays"
                :key="index + 'day'"
                class="calendar__days-item calendar__days-item--heading"
            >
                <div
                    :class="{
                        'calendar__day-name': true,
                        'calendar__day-name--weekends': item.isWeekends
                    }"
                >
                    {{ item.name }}
                </div>
            </div>
            <div
                v-for="(item, index) in selectedMonthDays"
                :key="index"
                class="calendar__days-item"
            >
                <div
                    :class="{
                        'calendar__day': true,
                        'calendar__day--featured': item.isFeatured,
                        'calendar__day--active': item.isActive,
                        'calendar__day--weekends': item.isWeekends,
                        'calendar__day--inactive': !item.isActiveMonth,
                        'calendar__day--archived': item.isArchived
                    }"
                    @click="select(item.date)"
                >
                    {{ item.date.getDate() }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

import ArrowIcon from '../assets/triangle-arrow.svg?component'

export default {
    name: 'WCalendar',
    components: {
        ArrowIcon
    },
    props: {
        date: {
            type: Date,
            default: () => new Date()
        },
        current: {
            type: Date,
            default: () => new Date()
        },
        featured: {
            type: Array,
            default: () => []
        },
        value: {
            type: Date,
            default: () => new Date()
        }
    },
    computed: {
        fromDate() {
            return this.selectedMonthDays[0].date
        },
        toDate() {
            const last = this.selectedMonthDays.length - 1

            return this.selectedMonthDays[last].date
        },
        selectedYear() {
            return this.date.getFullYear()
        },
        selectedMonth() {
            return this.date.getMonth()
        },
        selectedMonthYearString() {
            return moment(this.date).locale('ru').format('MMMM YYYY')
        },
        selectedMonthDays() {
            // Set last months day
            const date = new Date(this.selectedYear, this.selectedMonth + 1, 0)
            const endedOnSunday = date.getDay() === 0

            date.setDate(1)

            const startedFromMonday = date.getDay() === 1
            const result = []

            if (!startedFromMonday) {
                date.setDate(0)

                while (date.getDay() !== 0) {
                    result.unshift({
                        date: new Date(date),
                        isFeatured: this.isFeatured(date),
                        isArchived: moment(date).isBefore(this.today, 'day'),
                        isActive: moment(date).isSame(this.selected, 'day')
                    })

                    date.setDate(date.getDate() - 1)
                }

                date.setMonth(date.getMonth() + 1)
                date.setDate(1)
            }

            while (date.getMonth() === this.selectedMonth) {
                result.push({
                    date: new Date(date),
                    isFeatured: this.isFeatured(date),
                    isArchived: moment(date).isBefore(this.today, 'day'),
                    isActive: moment(date).isSame(this.selected, 'day'),
                    isWeekends: this.isWeekends(date.getDay()),
                    isActiveMonth: true
                })

                date.setDate(date.getDate() + 1)
            }

            if (!endedOnSunday) {
                while (date.getDay() !== 1) {
                    result.push({
                        date: new Date(date),
                        isFeatured: this.isFeatured(date),
                        isArchived: moment(date).isBefore(this.today, 'day'),
                        isActive: moment(date).isSame(this.selected, 'day')
                    })

                    date.setDate(date.getDate() + 1)
                }
            }

            return result
        },
        weekDays() {
            return [
                { name: 'пн', isWeekends: false },
                { name: 'вт', isWeekends: false },
                { name: 'ср', isWeekends: false },
                { name: 'чт', isWeekends: false },
                { name: 'пт', isWeekends: false },
                { name: 'сб', isWeekends: true },
                { name: 'вс', isWeekends: true }
            ]
        }
    },
    data() {
        return {
            initialized: false,
            activated: false,
            selected: null,
            today: new Date(),
            showCalendar: true
        }
    },
    methods: {
        next() {
            const next = new Date(this.date)
            next.setMonth(next.getMonth() + 1, 1)

            this.date = next
        },
        previous() {
            const previous = new Date(this.date)
            previous.setMonth(previous.getMonth() - 1, 1)

            this.date = previous
        },
        select(date) {
            const diff = date.getMonth() - this.date.getMonth()

            this.activated = true
            this.selected = new Date(date)

            if (diff > 0) {
                return this.next()
            }

            if (diff < 0) {
                return this.previous()
            }

            return undefined
        },
        isWeekends(day) {
            return day === 0 || day === 6
        },
        isFeatured(date) {
            return !!this.featured.find((el) => moment(el).isSame(date, 'day'))
        },
        onDayChanged() {
            this.$emit('on-day-changed', this.selected)
        },
        onMonthChanged() {
            const { fromDate: from, toDate: to } = this

            this.$emit('on-month-changed', { from, to })
        },
        filteredDate(date) {
            return moment(date).format('L').split('/').join('.')
        }
    },
    created() {
        this.date = new Date(this.current)
        this.selected = new Date(this.date)
        this.onMonthChanged()
    },
    watch: {
        activated(val, oldval) {
            if (val === oldval) return undefined
            if (val === true) {
                this.$emit('on-activated', true)
            }

            return undefined
        },
        selected() {
            if (!this.initialized) {
                this.initialized = true
                return this.initialized
            }

            this.onDayChanged()

            return undefined
        },
        date() {
            this.onMonthChanged()
        }
    }
}
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap&subset=cyrillic-ext');

    .calendar__wrapper {
        box-sizing: border-box;
        flex: 0 0 100%;
    }

    .calendar-input__wrapper {
        position: relative;
        width: 200px;
    }

    .calendar-input {
        padding: 11px 11px;
        border: 1px solid #E8E8E8;
        font-size: 15px;
        letter-spacing: 0.04em;
        border-radius: 4px;
        width: 178px;
    }

    .calendar-input__icon {
        fill: #b0b6bb;
        position: absolute;
        top: 11px;
        right: 11px;

        &:hover {
            fill: #333;
            cursor: pointer;
        }
    }

    .calendar {
        font-family: 'Roboto', sans-serif;
        box-sizing: border-box;
        height: auto;
        background: #fff;
        box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        border: none;
        padding: 0 10px 18px;
        width: 310px;
    }

    .calendar__header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 0 4px;
    }

    .calendar__date {
        text-transform: capitalize;
        font-weight: 500;
        font-size: 18px;
        line-height: 28px;
        color: #0ca9ef;
    }

    .calendar__controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 64px;
        user-select: none;
    }

    .calendar__controls-button {
        position: relative;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #f8f8f8;
        text-align: center;
        cursor: pointer;
        transition: transform .2s ease-in-out;
    }

    .calendar__controls-button:hover::after {
        opacity: 1;
        z-index: 2;
    }

    .calendar__controls-button::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        z-index: 1;
        border-radius: 50%;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
        opacity: 0;
        transition: opacity .2s ease-in-out;
    }

    .calendar__controls-icon {
        margin: 9px 0 0;
        display: inline-block;
        width: 10px;
        height: 10px;
        vertical-align: top;
        color: #979797;
        fill: #333;
        transform: rotate(270deg);
    }

    .calendar__controls-icon--left {
        transform: rotate(90deg);
    }

    .calendar__days {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-content: flex-start;
        width: 100%;
    }

    .calendar__days-item {
        display: flex;
        justify-content: center;
        text-align: center;
        flex: 1 0 13%;
        height: 32px;
        line-height: 33px;
        font-size: 14px;
        margin-bottom: 6px;
    }

    .calendar__days-item--heading {
        padding: 12px 0 8px 0;
        height: 12px !important;
        font-size: 12px !important;
        line-height: 1 !important;
        border-bottom: 1px solid #e0e0e0;
    }

    .calendar__day {
        display: inline-block;
        box-sizing: border-box;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: #333;
        cursor: pointer;
        transition:
            background-color .1s ease-in-out, color .2s ease-in-out,
            opacity .2s ease-in-out;
    }

    .calendar__day-name {
        display: inline-block;
        color: #333;
    }

    .calendar__day--weekends,
    .calendar__day-name--weekends {
        color: #757575;
    }

    .calendar__day:hover,
    .calendar__day--active {
        background-color: #f0f0f0;
    }

    .calendar__day--inactive {
        opacity: 0.18;
    }

    .calendar__day--featured {
        color: #ff2e2e;
        border: 2px solid #ff2e2e;
        line-height: 30px;
    }

    .calendar__day--featured:hover,
    .calendar__day--active.calendar__day--featured {
        background-color: #ff2e2e;
        color: #fff;
        box-shadow: 0px 2px 14px rgba(224, 18, 18, 0.2);
    }

    .calendar__day--archived.calendar__day--featured {
        border-color: #9c9c9c;
        color: #9c9c9c;
    }

    .calendar__day--archived.calendar__day--featured:hover,
    .calendar__day--active.calendar__day--archived.calendar__day--featured {
        box-shadow: 0px 2px 14px rgba(192, 174, 174, 0.2);
        background-color: #9c9c9c;
        color: #fff;
    }

    @media only screen and (min-width: 375px) {
        .calendar__days-item {
            height: 36px;
            line-height: 38px;
        }

        .calendar__day {
            width: 36px;
            height: 36px;
        }

        .calendar__day--featured {
            line-height: 34px;
        }
    }

    @media only screen and (min-width: 480px) {
        .tv-new__calendar {
            padding: 8px 28px 18px;
        }
    }

    @media only screen and (min-width: 768px) {
        .calendar__wrapper {
            flex: 0 0 325px;
        }

        .tv-new__calendar {
            padding: 0 18px 18px;
            margin-bottom: 20px;
        }
    }
</style>
