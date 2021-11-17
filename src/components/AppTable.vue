<template>
    <div
        ref="$table"
        class="app-table"
    >
        <div class="app-table__row app-table__row--header">
            <div
                v-for="(col, index) in columns"
                :key="index"
                class="app-table__cell app-table__cell--header"
                :style="{ width: styles[index] }"
            >
                <div
                    :class="{
                        'app-table__cell-inner': true,
                        'app-table__cell-inner--sortable': !!col.sort
                    }"
                    @click="sort(col)"
                >
                    {{ col.name }}
                    <div
                        v-if="col.sort"
                        class="app-table__sort"
                    >
                        <div
                            v-if="sortOptions
                                && sortOptions.field === col.field
                                && sortOptions.ascending"
                            class="app-table__sort-icon"
                        />
                        <div
                            v-else-if="sortOptions
                                && sortOptions.field === col.field
                                && !sortOptions.ascending"
                            class="app-table__sort-icon"
                        />
                        <div
                            v-else
                            class="app-table__sort-icon"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="!sorted.length"
            class="app-table__row"
        >
            <div class="app-table__cell app-table__cell--text-center">
                Данные не найдены
            </div>
        </div>
        <div
            v-for="(row, index) in sorted"
            :key="index"
            class="app-table__row"
        >
            <div
                v-for="(cell, cellIndex) in cells"
                :key="cell"
                :style="{ width: styles[cellIndex] }"
                class="app-table__cell"
            >
                <slot
                    name="cell"
                    :cell="row[cell]"
                    :field="cell"
                />
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import moment from 'moment'

const isAppTableColumn = (item) => {
    if (!item) return false
    if (!item.name || typeof item.name !== 'string') return false
    if (!item.field || typeof item.field !== 'string') return false
    if (item.width && typeof item.width !== 'number') return false
    if (item.sort !== undefined
        && typeof item.sort !== 'boolean'
        && typeof item.sort !== 'function'
    ) return false
    return true
}
export default {
    props: {
        columns: {
            type: Array,
            validator: (value) => !value.some((element) => !isAppTableColumn(element)),
            required: true
        },
        data: {
            type: Array,
            default: () => []
        },
        hideUntitled: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        sortOptions: {},
        width: undefined
    }),
    computed: {
        cells() {
            return this.columns.map((element) => element.field)
        },
        sorted() {
            const { field, ascending } = this.sortOptions

            if (!field) return this.data

            const column = this.columns.find((element) => element.field === field)

            if (column === undefined || column.sort === undefined) {
                return this.data
            }

            const row = this.data[0]
            const fieldType = typeof row[field]
            const fieldIsDate = fieldType === 'object'
                && (row[field] instanceof Date || moment.isMoment(row[field]))

            if (typeof column.sort === 'function') {
                const { sort } = column

                return [...this.data].sort((a, b) => sort(a[field], b[field], ascending))
            }

            switch (true) {
                case fieldType === 'number':
                    return [...this.data].sort(
                        (a, b) => this.sortNumbers(a[field], b[field], ascending)
                    )
                case fieldType === 'string':
                    return [...this.data].sort(
                        (a, b) => this.sortStrings(a[field], b[field], ascending)
                    )
                case fieldIsDate:
                    return [...this.data].sort(
                        (a, b) => this.sortDates(a[field], b[field], ascending)
                    )
                default:
                    return [...this.data].sort(
                        (a, b) => this.sortNumbers(a[field], b[field], ascending)
                    )
            }
        },
        styles() {
            const totalUnspecifiedWidthColumns = this.columns.filter(
                (element) => !element.width
            ).length
            const reminder = this.width - this.columns.reduce(
                (acc, element) => (acc += (element.width || 0)), 0
            )
            const unspecifiedWidth = Math.ceil(
                ((reminder / totalUnspecifiedWidthColumns) + Number.EPSILON) * 100
            ) / 100

            return this.columns.map((element) => `${element.width || unspecifiedWidth}px`)
        }
    },
    methods: {
        sort(column) {
            const { field: columnField, sort: columnSort } = column

            if (!columnField) {
                return undefined
            }

            this.onSort(columnField)

            if (!columnSort) {
                return undefined
            }

            const { field: sortingField, ascending: sortingAscending } = this.sortOptions

            this.sortOptions = {
                field: columnField,
                ascending: sortingField === columnField ? !sortingAscending : true
            }
            return undefined
        },
        onSort(field) {
            this.$emit('on-sort', field)
        },
        sortNumbers(numberA, numberB, ascending) {
            return ascending ? numberA - numberB : numberB - numberA
        },
        sortStrings(stringA, stringB, ascending) {
            if (ascending) {
                return stringA > stringB ? 1 : -1
            }
            return stringA < stringB ? 1 : -1
        },
        sortDates(dateA, dateB, ascending) {
            return ascending ? moment(dateA).diff(dateB) : moment(dateB).diff(dateA)
        },
        updateTableSizes() {
            this.width = this.$refs.$table.clientWidth || 0
        }
    },
    mounted() {
        this.updateTableSizes()
        window.addEventListener('resize', this.updateTableSizes)
    },
    destroyed() {
        window.removeEventListener('resize', this.updateTableSizes)
    }
}
</script>

<style lang="scss">
.app-table {
    display: flex;
    flex-direction: column;
    font-size: px-to-rem(14);
    width: 100%;

    &__row {
        border-bottom: px-to-rem(1) solid #e8e8e8;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        &--header {
            background-color: #f3f3f3;
            border: none;
        }

        &:last-child {
            border: none;
        }
    }

    &__column {
        display: flex;
        flex-direction: column;
    }

    &__cell {
        color: #333;
        display: flex;
        flex-grow: 1;
        padding: px-to-rem(26) px-to-rem(20);

        &--header {
            color: #757575;
            padding: px-to-rem(16) px-to-rem(20);
        }

        &--text-center {
            justify-content: center;
        }
    }

    &__cell-inner {
        display: flex;

        &--sortable {
            cursor: pointer;
            user-select: none;
        }
    }

    &__sort {
        align-items: center;
        display: flex;
        padding-left: px-to-rem(5);
        padding-top: px-to-rem(2);
    }

    &__sort-icon {
        fill: #757575;
        height: px-to-rem(8);
        width: px-to-rem(7);
    }
}
</style>
