# Vue with Vuex

## Motivation

Finally took a slight closer look on [Vue](https://vuejs.org/) with [Vuex](https://vuex.vuejs.org/). With experience working with [Polymer](https://www.polymer-project.org/) and [Redux](https://redux.js.org/docs/introductionhttps://redux.js.org/docs/introduction//), understanding Vue seemed natrual.



## Vue

vue-cli creates a project with all build, linter, HMR etc set up which is really nice and fast. When using polymer, Polyer build doesn't make much sense to me compare to using vulcanize.

Vue components does not has as much boiler plate code compare to Polymer.


### One Way data flow

One thing Polymer supports is two-way data binding, after started using Redux, I turned all the `{{}}`(two-way binding) into `[[]]`(one-way binding) in project. And use events to send update back to "parent" component. It is vital to have the confidence that child element won't mess with parent-element/application-state directly. This has been enforce by Vue which is really nice to see.


### Hapiness in pieces

#### declaritive prop binding attr
```html
    <input class="edit"
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit">
```
I like how declaritive with these native dom events are.
In polymer, `on-` are used for event listeners, binding `value` would look like `value="[[text]]"`,

#### JS syntax on element
```html
<div v-if="type === 'A'">
  A
</div>
```
JS syntax on logic is neat can see exactly what's going on with the element without navigating to js code

#### template if and else

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

interesting seems like else statement is not supported by polymer yet.


### Sadness in pieces

So far I haven't get to touch on the nasty stuff yet. Will update this section in the future.

## Vuex

Less boiler plate code compare to redux ofcourse. Although, if a user have not used redux may be confused by the syntax in vue. I would personally recommend go through Dan's free Redux [tutorial](https://egghead.io/courses/getting-started-with-redux) on egghead.io would be good way to learn when and how the code looks like the way they are presented.

`state`, `actions`, `mutation` in Vue kind of map to `state`, `actions`, `reducer` in Redux which is very straight forward to understand.

### Module
Vuex has `module` which supports multiple "store" allows you to split your potentially "big" state and modulize them. Remember Dan Abbramov has talked about having one single store is fine especially

### Getter
Vuex `getter` is like [reselect](https://github.com/reactjs/reselect) which creates computed value from state.

## Polymer

One thing really cool about Polymer as a first time uesr years ago was how easy to use those super cool webcomponents such as [paper-input](https://www.webcomponents.org/element/PolymerElements/paper-input), [paper-button](https://www.webcomponents.org/element/PolymerElements/paper-button) etc. So far for vue, I haven't expereienced importing external components.



After working with [Webcomponents/Polymer](https://www.polymer-project.org/) and Redux for a while,
