const jshop = require('../lib/index')
const test = require('tape')

test('fill in this', function (t) {
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

function setup () {
  let travel = jshop.create()

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
  travel.operators({walk, callTaxi, rideTaxi, payDriver})

  const travelByFoot = (state, a, x, y) => {
    if (state.dist[x][y] <= 2) return [['walk', a, x, y]]
    return null
  }

  const travelByTaxi = (state, a, x, y) => {
    if (state.cash[a] >= taxiRate(state.dist[x][y])) {
      return [['callTaxi', a, x], ['rideTaxi', a, x, y], ['payDriver', a]]
    }
    return null
  }

  travel.setMethods('travel', [travelByFoot, travelByTaxi])
  return travel
}
