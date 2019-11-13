import { useSuspensible } from '../src'
import { renderHook } from '@testing-library/react-hooks'

describe('useSuspensible', () => {
  it('should trigger suspense', () => {
    // eslint-disable-next-line prefer-const
    let data: number

    const { result, rerender } = renderHook(() => {
      try {
        useSuspensible(data)
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Promise)

    data = 2
    rerender()
    expect(result.current).not.toBeInstanceOf(Promise)
  })

  it('should trigger suspense with custom isFinish', () => {
    interface StatePending {
      status: 'pending'
      value: null
    }

    interface StateFinish {
      status: 'finish'
      value: number
    }

    type States = StatePending | StateFinish

    let data: States = {
      status: 'pending',
      value: null
    }

    const { result, rerender } = renderHook(() => {
      try {
        useSuspensible(
          data,
          (data: States): data is StateFinish => data.status === 'finish'
        )
      } catch (e) {
        return e
      }
    })
    expect(result.current).toBeInstanceOf(Promise)

    data = {
      status: 'finish',
      value: 12
    }
    rerender()
    expect(result.current).not.toBeInstanceOf(Promise)
  })

  it('should do nothing if data is ready at the begining', () => {
    let data = 'data1'

    const { result, rerender } = renderHook(() => {
      try {
        useSuspensible(data)
      } catch (e) {
        return e
      }
    })
    expect(result.current).not.toBeInstanceOf(Promise)

    data = 'data2'
    rerender()
    expect(result.current).not.toBeInstanceOf(Promise)
  })

  it('should throw the same promise when data is not ready', () => {
    // eslint-disable-next-line prefer-const
    let data: number

    const { result, rerender } = renderHook(() => {
      try {
        useSuspensible(data)
      } catch (e) {
        return e
      }
    })

    const promise1 = result.current
    expect(promise1).toBeInstanceOf(Promise)

    rerender()
    expect(result.current).toBe(promise1)

    rerender()
    expect(result.current).toBe(promise1)
  })
})
