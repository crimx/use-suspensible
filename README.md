# [use-suspensible](https://github.com/crimx/use-suspensible)

[![npm-version](https://img.shields.io/npm/v/use-suspensible.svg)](https://www.npmjs.com/package/use-suspensible)
[![Build Status](https://img.shields.io/travis/com/crimx/use-suspensible/master)](https://travis-ci.com/crimx/use-suspensible)
[![Coverage Status](https://img.shields.io/coveralls/github/crimx/use-suspensible/master)](https://coveralls.io/github/crimx/use-suspensible?branch=master)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?maxAge=2592000)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-brightgreen.svg?maxAge=2592000)](https://conventionalcommits.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

![use-suspensible](./assets/use-suspensible.png)

React hooks that can make any data suspensible.

## Why?

This is a proof-of-concept for using Suspense with non-promise based async libraries.
Also see [observable-hooks](https://observable-hooks.js.org/guide/render-as-you-fetch-suspense.html) on implementing [Render-as-You-Fetch](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) pattern with Suspense and Rxjs Observable.

## Installation

yarn

```bash
yarn add use-suspensible
```

npm

```bash
npm install --save use-suspensible
```

## Usage

```jsx
import React, { Suspense, useState, useEffect } from 'react'
import { useSuspensible } from 'use-suspensible'

function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ content: "content" })
    }, 3000)
  })
}

const App = () => {
  const [data, setData] = useState()
  useEffect(
    () => {
      fetchData().then(setData)
    },
    []
  )

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Content data={data} />
    </Suspense>
  )
}

function Content({ data }) {
  useSuspensible(data)
  return (
    <h1>{data.content}</h1>
  );
}
```

Default trigger Suspense on `null` or `undefined`.

```typescript
useSuspensible(data)
```

Custom comparison for checking finish state.

```typescript
useSuspensible(data, data => data.status === 'finish')
```

You can have any number of `useSuspensible` in a Component.

```jsx
useSuspensible(data1)
useSuspensible(data2)
useSuspensible(data3, data => data.status === 'finish')

return (
  <>
    <h1>{data1.content}</h1>
    <h1>{data2.content}</h1>
    <h1>{data3.content}</h1>
  </>
)
```

TypeScript >= 3.7

```typescript
interface StatePending {
  status: 'pending'
  value: null
}

interface StateFinish {
  status: 'finish'
  value: number
}

type States = StatePending | StateFinish

//....

useSuspensible(
  data,
  (data: States): data is StateFinish => data.status === 'finish'
)

// Now data is of `StateFinish` type.
```

## Beware

Due to the design of Suspense, each time a suspender is thrown, the children of `Suspense` Component will be destroyed and reloaded. Do not initialize async data and trigger Suspense in the same Component.

```jsx
import React, { Suspense, useState, useEffect } from 'react'
import { useSuspensible } from 'use-suspensible'

function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ content: "content" })
    }, 3000)
  })
}

const App = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Content />
    </Suspense>
  )
}

function Content({ data }) {
  const [data, setData] = useState()
  // This will cause infinite update.
  useEffect(
    () => {
      fetchData().then(setData)
    },
    []
  )
  useSuspensible(data)
  return (
    <h1>{data.content}</h1>
  );
}
```
