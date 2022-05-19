export const getUnrated = users => {
  const unratedUsers = users.filter(user => !user.rating)

  return unratedUsers
}

export const getByRating = (users, fromLess) => {
  const newUsers = [...users.filter(su => su.rating)].sort(
    (a, b) => +a.rating - b.rating
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

export const getByName = (users, fromA) => {
  const newUsers = [...users].sort(function (a, b) {
    const aName = a.nickname || a.name
    const bName = b.nickname || b.name
    if (aName > bName) {
      return 1
    }
    if (bName > aName) {
      return -1
    }
    return 0
  })

  if (fromA) {
    return newUsers
  } else {
    return newUsers.reverse()
  }
}

export const getAlreadyKnown = users => {
  const newUsers = [...users].filter(user => user.level === 'already known')

  return newUsers
}
