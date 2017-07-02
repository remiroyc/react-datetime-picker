import moment from 'moment'

import toMomentObject from './toMomentObject'

const ISO_FORMAT = 'YYYY-MM-DD'

export default function toISODateString(date, currentFormat) {
  const dateObj = moment.isMoment(date)
    ? date
    : toMomentObject(date, currentFormat)
  if (!dateObj) return null

  return dateObj.format(ISO_FORMAT)
}
