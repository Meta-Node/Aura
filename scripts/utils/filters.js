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

export const getByAmount = (users, fromLess) => {
  const newUsers = [...users.filter(su => su.transferedEnergy)].sort(
    (a, b) => +a.transferedEnergy - b.transferedEnergy
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
      new Date(a.ratingData.createdAt).getTime() -
      new Date(b.ratingData.createdAt).getTime()
  )
  if (fromLess) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getExcludeZeros = (users, _value) => {
  return users.filter(su => su.transferedEnergy)
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

export const trim = str => {
  return str.trim().toLowerCase()
}

export const onSearch = (value, users) => {
  const foundUsers = users.filter(el => {
    if (el.nickname && trim(el.nickname).includes(value)) {
      return true
    }
    if (trim(el.name).includes(value)) {
      return true
    }
    return false
  })
  return foundUsers
}
