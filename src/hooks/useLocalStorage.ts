import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes - memoized to prevent recreation
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Use setStoredValue's functional form to get the current value
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
        return valueToStore
      })
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error)
    }
  }, [key]) // Only depend on key, not storedValue

  return [storedValue, setValue]
}
