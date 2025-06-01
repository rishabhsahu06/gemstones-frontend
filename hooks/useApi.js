"use client"

import { useState, useCallback } from "react"
import api from "@/lib/axios"

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (method, url, data = null, options = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await api({
        method,
        url,
        data,
        ...options,
      })

      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const get = useCallback((url, options) => request("get", url, null, options), [request])
  const post = useCallback((url, data, options) => request("post", url, data, options), [request])
  const put = useCallback((url, data, options) => request("put", url, data, options), [request])
  const patch = useCallback((url, data, options) => request("patch", url, data, options), [request])
  const del = useCallback((url, options) => request("delete", url, null, options), [request])

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
  }
}
