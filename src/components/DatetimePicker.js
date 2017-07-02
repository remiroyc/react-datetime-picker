import PropTypes from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import OutsideClickHandler from './OutsideClickHandler'
import CalendarMonthGrid from './CalendarMonthGrid'
import './DatetimePicker.scss'

class DatetimePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDatetime: new Date().getTime(),
      opened: false
    }
    this.onOutsideClick = this.onOutsideClick.bind(this)
    this.onDatepickerButtonClick = this.onDatepickerButtonClick.bind(this)
  }

  formatDatetime(datetime, locale, includeTime = true) {
    const date = new Date(datetime)
    if (includeTime) {
      return `${date.toLocaleDateString(locale)} ${date.toLocaleTimeString(locale)}`
    }
    return date.toLocaleDateString(locale)
  }

  onDatepickerButtonClick(e) {
    e.preventDefault()
    this.setState({ opened: !this.state.opened })
  }

  onOutsideClick() {
    // const { onFocusChange, onClose, startDate, endDate } = this.props

    if (this.state.opened) {
      this.setState({
        opened: false
      })
    }

    // onFocusChange(null)
    // onClose({ startDate, endDate })
  }

  render() {
    return (
      <div className="datetime-picker">
        <OutsideClickHandler onOutsideClick={this.onOutsideClick}>
          <div onClick={this.onDatepickerButtonClick}>
            {this.formatDatetime(this.state.currentDatetime, this.props.locale)}
          </div>

          {this.state.opened &&
            <div className="datetime-picker__container">
              <CalendarMonthGrid />
            </div>}

        </OutsideClickHandler>

      </div>
    )
  }
}

DatetimePicker.defaultProps = {
  locale: 'en'
}

export default DatetimePicker
