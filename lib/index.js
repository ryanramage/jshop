const _ = require('lodash')

exports.create = function () {
  let operators = {}
  let taskMethods = {}
  return {
    operators: addOperators.bind(null, operators),
    setMethods: setMethods.bind(null, taskMethods),
    solve: solve.bind(null, operators, taskMethods)
  }
}

function addOperators (currentOperators, toAdd) {
  _.extend(currentOperators, toAdd)
}

function setMethods (currentTaskMethods, taskName, toAdd) {
  currentTaskMethods[taskName] = toAdd
}

function solve (operators, taskMethods, state, tasks) {
  return seekPlan(operators, taskMethods, state, tasks, [], 0)
}

function seekPlan (operators, taskMethods, state, tasks, plan, depth) {
  if (!tasks.length) return plan
  let task1 = tasks[0]
  let taskName = task1[0]
  if (operators[taskName]) {
    let operator = operators[taskName]
    let args = _.concat([_.cloneDeep(state)], _.tail(task1))
    let newstate = operator.apply(null, args)
    if (newstate) {
      let solution = seekPlan(operators, taskMethods, newstate, _.tail(tasks), _.concat(plan, [task1]), depth + 1)
      if (solution) return solution
    }
  }
  if (taskMethods[taskName]) {
    let solution = null
    taskMethods[taskName].find(method => {
      let args = _.concat([state], _.tail(task1))
      let subtasks = method.apply(null, args)
      if (subtasks !== null) solution = seekPlan(operators, taskMethods, state, _.concat(subtasks, _.tail(tasks)), plan, depth + 1)
    })
    return solution
  }
  return null
}
