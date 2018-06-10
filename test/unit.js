const jshop = require('../lib/index')
const test = require('tape')

const taxiRate = (dist) => (1.5 + 0.5 * dist)
const walk = (state, a, x, y) => {
  if (state.loc[a] === x) {
    state.loc[a] = y
    return state
  } else return null
}
const callTaxi = (state, a, x) => {
  state.loc['taxi'] = x
  return state
}
const rideTaxi = (state, a, x, y) => {
  if (state.loc['taxi'] === x && state.loc[a] === x) {
    state.loc['taxi'] = y
    state.loc[a] = y
    state.owe[a] = taxiRate(state.dist[x][y])
    return state
  } else return null
}
const payDriver = (state, a) => {
  if (state.cash[a] >= state.owe[a]) {
    state.cash[a] = state.cash[a] - state.owe[a]
    state.owe[a] = 0
    return state
  } else return null
}

test('travel example 1', function (t) {
  let state1 = {}
  state1.loc = {me: 'home'}
  state1.cash = {me: 20}
  state1.owe = {me: 0}
  state1.dist = {home: {park: 8}, park: {home: 8}}
  let travel = setup()
  let solution = travel.solve(state1, [['travel', 'me', 'home', 'park']])
  t.deepEquals(solution[0], ['callTaxi', 'me', 'home'])
  t.deepEquals(solution[1], ['rideTaxi', 'me', 'home', 'park'])
  t.deepEquals(solution[2], ['payDriver', 'me'])
  t.ok(solution)
  t.end()
})

test('travel example 2', function (t) {
  let state1 = {}
  state1.loc = {me: 'home'}
  state1.cash = {me: 2}
  state1.owe = {me: 0}
  state1.dist = {home: {park: 1.3}, park: {home: 1.3}}
  let travel = setup()
  let solution = travel.solve(state1, [['travel', 'me', 'home', 'park']])
  t.deepEquals(solution[0], ['walk', 'me', 'home', 'park'])
  t.ok(solution)
  t.end()
})

test('move state forward and re-plan', function (t) {
  let state1 = {}
  state1.loc = {me: 'home'}
  state1.cash = {me: 20}
  state1.owe = {me: 0}
  state1.dist = {home: {park: 8}, park: {home: 8}}
  let travel = setup()
  let solution = travel.solve(state1, [['travel', 'me', 'home', 'park']])
  t.deepEquals(solution[0], ['callTaxi', 'me', 'home'])
  let state2 = callTaxi(state1, 'me', 'home')
  let solution2 = travel.solve(state2, [['travel', 'me', 'home', 'park']])
  t.deepEquals(solution2[0], ['rideTaxi', 'me', 'home', 'park'])
  let state3 = rideTaxi(state2, 'me', 'home', 'park')
  t.ok(state3)
  t.end()
})

function setup () {
  let travel = jshop.create()
  travel.operators({walk, callTaxi, rideTaxi, payDriver})

  const travelByFoot = (state, a, x, y) => {
    if (state.dist[x][y] <= 2) return [['walk', a, x, y]]
    return null
  }

  const travelByTaxi = (state, a, x, y) => {
    if (state.cash[a] < taxiRate(state.dist[x][y])) return null
    if (state.loc.taxi === state.loc.me) return [['rideTaxi', a, x, y], ['payDriver', a]]
    return [['callTaxi', a, x], ['rideTaxi', a, x, y], ['payDriver', a]]
  }

  travel.setMethods('travel', [travelByFoot, travelByTaxi])
  return travel
}
