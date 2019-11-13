import { useRef } from 'react'

interface Handler<T = any> {
  suspender: Promise<T>
  resolve: (value?: T) => void
}

export function useSuspensible<T, S extends T = NonNullable<T>>(
  value: T,
  isFinish = (value: T): value is S => value != null
): asserts value is S {
  const handlerRef = useRef<null | Handler>(null)

  if (isFinish(value)) {
    if (handlerRef.current) {
      const { resolve } = handlerRef.current
      handlerRef.current = null
      resolve()
    }
  } else {
    if (!handlerRef.current) {
      const handler: Partial<Handler> = {}
      handler.suspender = new Promise(resolve => {
        handler.resolve = resolve
      })
      handlerRef.current = handler as Handler
    }
    throw handlerRef.current.suspender
  }
}
