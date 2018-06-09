# jshop

 a simple HTN, SHOP-like planner written in js, based on [Pyhop](https://bitbucket.org/dananau/pyhop)

 jshop was easy to implement (less than 50 lines of code), and if you understand the basic ideas of HTN planning ([this presentation](http://www.cs.umd.edu/~nau/papers/nau2013game.pdf) contains a quick summary), jshop should be easy to understand.

 jshop's planning algorithm is like the one in SHOP, but with several differences that should make it easier to integrate it with ordinary computer programs:

 jshop represents states of the world using ordinary variable bindings, not logical propositions. A state is just a js object. For example, you might write s.loc['v'] = 'd' to say that vehicle v is at location d in state s.

 To write HTN operators and methods for jshop, you don't need to learn a specialized planning language. Instead, you write them as ordinary js functions. The current state (e.g., s in the above example) is passed to them as an argument.

## Module Usage

```
npm install jshop
```

see the test/unit.js file for an example usage. more to follow.

## License

MIT
