import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import cx from "classnames";

import CalendarDay from "./CalendarDay";

import getCalendarMonthWeeks from "../utils/getCalendarMonthWeeks";
import isSameDay from "../utils/isSameDay";
import toISODateString from "../utils/toISODateString";

const defaultProps = {
  month: moment(),
  isVisible: true,
  enableOutsideDays: false,
  modifiers: {},
  daySize: 39,
  onDayClick() {},
  onDayMouseEnter() {},
  onDayMouseLeave() {},
  renderMonth: null,
  renderDay: null,
  focusedDate: null,
  isFocused: false,
  monthFormat: "MMMM YYYY" // english locale
};

export default class CalendarMonth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: getCalendarMonthWeeks(props.month, props.enableOutsideDays)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { month, enableOutsideDays } = nextProps;
    if (!month.isSame(this.props.month)) {
      this.setState({
        weeks: getCalendarMonthWeeks(month, enableOutsideDays)
      });
    }
  }

  render() {
    const {
      month,
      monthFormat,
      orientation,
      isVisible,
      modifiers,
      onDayClick,
      onDayMouseEnter,
      onDayMouseLeave,
      renderMonth,
      renderDay,
      daySize,
      focusedDate,
      isFocused
    } = this.props;

    const { weeks } = this.state;
    const monthTitle = renderMonth
      ? renderMonth(month)
      : month.format(monthFormat);

    return (
      <div className="calendar-month" data-visible={isVisible}>
        <table>
          <caption className="calendar-month__caption">
            <strong>{monthTitle}</strong>
          </caption>

          <tbody className="calendar-month___grid">
            {weeks.map((week, i) => (
              <tr key={i}>
                {week.map((day, dayOfWeek) => (
                  <CalendarDay
                    day={day}
                    daySize={daySize}
                    isOutsideDay={!day || day.month() !== month.month()}
                    tabIndex={isVisible && isSameDay(day, focusedDate) ? 0 : -1}
                    isFocused={isFocused}
                    key={dayOfWeek}
                    onDayMouseEnter={onDayMouseEnter}
                    onDayMouseLeave={onDayMouseLeave}
                    onDayClick={onDayClick}
                    renderDay={renderDay}
                    modifiers={modifiers[toISODateString(day)]}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

CalendarMonth.defaultProps = defaultProps;
