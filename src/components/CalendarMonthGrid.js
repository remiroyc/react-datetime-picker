import React from "react";
import PropTypes from "prop-types";

import moment from "moment";
import cx from "classnames";
import { addEventListener, removeEventListener } from "consolidated-events";

import CalendarMonth from "./CalendarMonth";

import getCalendarMonthWidth from "../utils/getCalendarMonthWidth";
import toISOMonthString from "../utils/toISOMonthString";
import isAfterDay from "../utils/isAfterDay";

const defaultProps = {
  enableOutsideDays: false,
  firstVisibleMonthIndex: 0,
  initialMonth: moment(),
  isAnimating: false,
  numberOfMonths: 1,
  modifiers: {},
  orientation: "horizontal",
  onDayClick() {},
  onDayMouseEnter() {},
  onDayMouseLeave() {},
  onMonthTransitionEnd() {},
  renderMonth: null,
  renderDay: null,
  transformValue: "none",
  daySize: 39,
  focusedDate: null,
  isFocused: false,
  monthFormat: "MMMM YYYY" // english locale
};

function getMonths(initialMonth, numberOfMonths, withoutTransitionMonths) {
  let month = initialMonth.clone();
  if (!withoutTransitionMonths) month = month.subtract(1, "month");

  const months = [];
  for (
    let i = 0;
    i < (withoutTransitionMonths ? numberOfMonths : numberOfMonths + 2);
    i += 1
  ) {
    months.push(month);
    month = month.clone().add(1, "month");
  }

  return months;
}

export default class CalendarMonthGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: getMonths(props.initialMonth, props.numberOfMonths, false)
    };
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  componentDidMount() {
    this.eventHandle = addEventListener(
      this.container,
      "transitionend",
      this.onTransitionEnd
    );
  }

  componentWillReceiveProps(nextProps) {
    const { initialMonth, numberOfMonths, orientation } = nextProps;
    const { months } = this.state;

    const hasMonthChanged = !this.props.initialMonth.isSame(
      initialMonth,
      "month"
    );
    const hasNumberOfMonthsChanged =
      this.props.numberOfMonths !== numberOfMonths;
    let newMonths = months;

    if (hasMonthChanged && !hasNumberOfMonthsChanged) {
      if (isAfterDay(initialMonth, this.props.initialMonth)) {
        newMonths = months.slice(1);
        newMonths.push(months[months.length - 1].clone().add(1, "month"));
      } else {
        newMonths = months.slice(0, months.length - 1);
        newMonths.unshift(months[0].clone().subtract(1, "month"));
      }
    }

    if (hasNumberOfMonthsChanged) {
      newMonths = getMonths(initialMonth, numberOfMonths, false);
    }

    this.setState({
      months: newMonths
    });
  }

  componentDidUpdate() {
    const { isAnimating, onMonthTransitionEnd } = this.props;

    // For IE9, immediately call onMonthTransitionEnd instead of
    // waiting for the animation to complete
    if (!this.isTransitionEndSupported && isAnimating) {
      onMonthTransitionEnd();
    }
  }

  componentWillUnmount() {
    removeEventListener(this.eventHandle);
  }

  onTransitionEnd() {
    this.props.onMonthTransitionEnd();
  }

  render() {
    const {
      enableOutsideDays,
      firstVisibleMonthIndex,
      isAnimating,
      modifiers,
      numberOfMonths,
      monthFormat,
      orientation,
      transformValue,
      daySize,
      onDayMouseEnter,
      onDayMouseLeave,
      onDayClick,
      renderMonth,
      renderDay,
      onMonthTransitionEnd,
      focusedDate,
      isFocused,
      phrases
    } = this.props;

    const { months } = this.state;

    const className = cx("CalendarMonthGrid", {
      "CalendarMonthGrid--animating": isAnimating
    });

    const calendarMonthWidth = getCalendarMonthWidth(daySize);

    const width = (numberOfMonths + 2) * calendarMonthWidth;
    const style = { width };

    return (
      <div
        ref={ref => {
          this.container = ref;
        }}
        className={className}
        style={style}
        onTransitionEnd={onMonthTransitionEnd}
      >
        {months.map((month, i) => {
          const isVisible =
            i >= firstVisibleMonthIndex &&
            i < firstVisibleMonthIndex + numberOfMonths;
          const monthString = toISOMonthString(month);
          return (
            <CalendarMonth
              key={monthString}
              month={month}
              isVisible={isVisible}
              enableOutsideDays={enableOutsideDays}
              modifiers={modifiers[monthString]}
              monthFormat={monthFormat}
              orientation={orientation}
              onDayMouseEnter={onDayMouseEnter}
              onDayMouseLeave={onDayMouseLeave}
              onDayClick={onDayClick}
              renderMonth={renderMonth}
              renderDay={renderDay}
              daySize={daySize}
              focusedDate={isVisible ? focusedDate : null}
              isFocused={isFocused}
              phrases={phrases}
            />
          );
        })}
      </div>
    );
  }
}

CalendarMonthGrid.defaultProps = defaultProps;
