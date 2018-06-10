const jshop = require('../lib/index')
const test = require('tape')

const taxiRate = (dist) => (1.5 + 0.5 * dist)
const walk = (state, who, from, to) => {
  if (state.loc[who] === from) {
    state.loc[who] = from
    return state
  } else return null
}
const callTaxi = (state, who, from) => {
  state.loc['taxi'] = from
  return state
}
const rideTaxi = (state, who, from, to) => {
  if (state.loc['taxi'] === from && state.loc[who] === from) {
    state.loc['taxi'] = to
    state.loc[who] = to
    state.owe[who] = taxiRate(state.dist[from][to])
    return state
  } else return null
}
const payDriver = (state, who) => {
  if (state.cash[who] >= state.owe[who]) {
    state.cash[who] = state.cash[who] - state.owe[who]
    state.owe[who] = 0
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

  const travelByFoot = (state, who, from, to) => {
    if (state.dist[from][to] <= 2) return [['walk', who, from, to]]
    return null
  }

  const travelByTaxi = (state, who, from, to) => {
    if (state.cash[who] < taxiRate(state.dist[from][to])) return null
    if (state.loc.taxi === state.loc[who]) return [['rideTaxi', who, from, to], ['payDriver', who]]
    return [['callTaxi', who, from], ['rideTaxi', who, from, to], ['payDriver', who]]
  }

  travel.setMethods('travel', [travelByFoot, travelByTaxi])
  return travel
}
