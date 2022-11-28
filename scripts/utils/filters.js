import {connectionLevelMap} from '~/utils/constants'

export const getUnrated = users => {
  const unratedUsers = users.filter(user => !user.rating)

  return unratedUsers
}

export const getByRating = (users, fromLess) => {
  const newUsers = [...users.filter(su => su.rating)].sort(
    (a, b) => +b.rating - a.rating
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getByIncomingRatingToConnection = (users, fromLess) => {
  const newUsers = [...users].sort(
    (a, b) =>
      Number(b.incomingRatingToConnection || 0) -
      Number(a.incomingRatingToConnection || 0)
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getByIncomingConnectionLevel = (users, fromLess) => {
  const newUsers = [...users].sort(
    (a, b) =>
      connectionLevelMap[b.incomingConnectionLevel] -
      connectionLevelMap[a.incomingConnectionLevel]
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getByAmount = (users, fromLess) => {
  const newUsers = [...users.filter(su => su.transferredEnergy)].sort(
    (a, b) => +a.transferredEnergy - b.transferredEnergy
  )
  if (fromLess) {
    return newUsers.reverse()
  } else {
    return newUsers
  }
}

export const getByRatingDate = (users, fromLess) => {
  const newUsers = [...users.filter(su => su.ratingData)].sort(
    (a, b) =>
      new Date(b.ratingData.updatedAt).getTime() -
      new Date(a.ratingData.updatedAt).getTime()
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getRecentConnection = (users, fromLess) => {
  const newUsers = [...users].sort(
    (a, b) =>
      new Date(b.connectionDate).getTime() -
      new Date(a.connectionDate).getTime()
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getExcludeZeros = (users, _value) => {
  return users.filter(su => su.transferredEnergy)
}

export const getByName = (users, fromA) => {
  const newUsers = [...users].sort(function (a, b) {
    const aName = a.nickname || a.name
    const bName = b.nickname || b.name
    if (aName > bName) {
      return -1
    }
    if (bName > aName) {
      return 1
    }
    return 0
  })

  if (fromA) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getAlreadyKnown = (users, value) => {
  if (value === 'All' || !value) {
    return users
  }

  if (value === 'Aready known+') {
    return [...users].filter(
      user => user.level === 'already known' || user.level === 'recovery'
    )
  }

  const newUsers = [...users].filter(user => user.level === value.toLowerCase())

  return newUsers
}

export const getAlreadyKnownPlus = users => {
  return [...users].filter(
    user => user.level === 'already known' || user.level === 'recovery'
  )
}

export const getJustMet = users => {
  return [...users].filter(user => user.level === 'just met')
}

export const trim = str => {
  return str?.trim().toLowerCase() || ''
}

function isBrightId(value) {
  return typeof value === 'string' && value.length === 43
}

export const onSearch = (value, users) => {
  const trimmedValue = trim(value)
  const finalUsers = users.filter(el => trim(el.nickname).includes(trimmedValue) ||
    trim(el.name).includes(trimmedValue) || trim(el.id).includes(trimmedValue))
  if (!finalUsers.length && isBrightId(value)) return [{id: value}]
  return finalUsers
}

