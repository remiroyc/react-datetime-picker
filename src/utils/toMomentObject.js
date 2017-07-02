import moment from 'moment'

const DISPLAY_FORMAT = 'L'
const ISO_FORMAT = 'YYYY-MM-DD'

export default function toMomentObject(dateString, customFormat) {
  const dateFormats = customFormat
    ? [customFormat, DISPLAY_FORMAT, ISO_FORMAT]
    : [DISPLAY_FORMAT, ISO_FORMAT]

  const date = moment(dateString, dateFormats, true)
  return date.isValid() ? date.hour(12) : null
}
