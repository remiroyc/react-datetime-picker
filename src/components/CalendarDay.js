import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import cx from 'classnames'

const defaultProps = {
  day: moment(),
  daySize: 39,
  isOutsideDay: false,
  modifiers: new Set(),
  isFocused: false,
  tabIndex: -1,
  onDayClick() {},
  onDayMouseEnter() {},
  onDayMouseLeave() {},
  renderDay: null
}

export default class CalendarDay extends React.Component {
  componentDidUpdate(prevProps) {
    const { isFocused, tabIndex } = this.props
    if (tabIndex === 0) {
      if (isFocused || tabIndex !== prevProps.tabIndex) {
        this.buttonRef.focus()
      }
    }
  }

  onDayClick(day, e) {
    const { onDayClick } = this.props
    onDayClick(day, e)
  }

  onDayMouseEnter(day, e) {
    const { onDayMouseEnter } = this.props
    onDayMouseEnter(day, e)
  }

  onDayMouseLeave(day, e) {
    const { onDayMouseLeave } = this.props
    onDayMouseLeave(day, e)
  }

  render() {
    const {
      day,
      daySize,
      isOutsideDay,
      modifiers,
      renderDay,
      tabIndex
    } = this.props

    if (!day) return <td />

    const className = cx(
      'CalendarDay',
      {
        'CalendarDay--outside': isOutsideDay
      },
      Array.from(modifiers, mod => `CalendarDay--${mod}`)
    )

    const formattedDate = `${day.format('dddd')}, ${day.format('LL')}`

    const daySizeStyles = {
      width: daySize,
      height: daySize - 1
    }

    return (
      <td className={className} style={daySizeStyles}>
        <button
          type="button"
          ref={(ref) => {
            this.buttonRef = ref
          }}
          className="CalendarDay__button"
          onMouseEnter={(e) => {
            this.onDayMouseEnter(day, e)
          }}
          onMouseLeave={(e) => {
            this.onDayMouseLeave(day, e)
          }}
          onMouseUp={(e) => {
            e.currentTarget.blur()
          }}
          onClick={(e) => {
            this.onDayClick(day, e)
          }}
          tabIndex={tabIndex}
        >
          {renderDay ? renderDay(day) : day.format('D')}
        </button>
      </td>
    )
  }
}

CalendarDay.defaultProps = defaultProps
