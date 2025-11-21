/**
 * Tests for health check functionality
 */

import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import { performHealthCheck } from '../src/health-check'
import type { ActionInputs } from '../src/types/dokploy'

// Mock dependencies
jest.mock('@actions/core')
jest.mock('@actions/http-client')
jest.mock('../src/utils/helpers', () => ({
  sleep: jest.fn().mockResolvedValue(undefined)
}))

describe('performHealthCheck', () => {
  const mockInfo = core.info as jest.MockedFunction<typeof core.info>
  const mockWarning = core.warning as jest.MockedFunction<typeof core.warning>
  const mockError = core.error as jest.MockedFunction<typeof core.error>

  const mockInputs: ActionInputs = {
    dokployUrl: 'https://dokploy.example.com',
    apiKey: 'test-key',
    dockerImage: 'nginx:latest',
    healthCheckEnabled: true,
    healthCheckRetries: 3,
    healthCheckInterval: 0.01, // 10ms for faster tests
    healthCheckTimeout: 10
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return skipped when health check is disabled', async () => {
    const inputs: ActionInputs = {
      ...mockInputs,
      healthCheckEnabled: false
    }

    const result = await performHealthCheck('https://example.com', inputs)

    expect(result).toBe('skipped')
    expect(mockInfo).toHaveBeenCalledWith('ℹ️ Health check disabled')
  })

  it('should return skipped when no deployment URL provided', async () => {
    const result = await performHealthCheck('', mockInputs)

    expect(result).toBe('skipped')
    expect(mockWarning).toHaveBeenCalledWith(
      '⚠️ No deployment URL available, skipping health check'
    )
  })

  it('should return healthy on successful check', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      message: { statusCode: 200 }
    })

    ;(httpm.HttpClient as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }))

    const result = await performHealthCheck('https://example.com', mockInputs)

    expect(result).toBe('healthy')
    expect(mockGet).toHaveBeenCalledWith('https://example.com/health')
  })

  it('should retry on failure', async () => {
    const mockGet = jest
      .fn()
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce({
        message: { statusCode: 200 }
      })

    ;(httpm.HttpClient as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }))

    const result = await performHealthCheck('https://example.com', mockInputs)

    expect(result).toBe('healthy')
    expect(mockGet).toHaveBeenCalledTimes(3)
  })

  it('should return unhealthy after max retries', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Connection failed'))

    ;(httpm.HttpClient as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }))

    const result = await performHealthCheck('https://example.com', mockInputs)

    expect(result).toBe('unhealthy')
    expect(mockGet).toHaveBeenCalledTimes(3)
    expect(mockError).toHaveBeenCalledWith(expect.stringContaining('Health check failed'))
  })

  it('should use custom health check URL', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      message: { statusCode: 200 }
    })

    ;(httpm.HttpClient as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }))

    const inputs: ActionInputs = {
      ...mockInputs,
      healthCheckUrl: '/api/status'
    }

    await performHealthCheck('https://example.com', inputs)

    expect(mockGet).toHaveBeenCalledWith('https://example.com/api/status')
  })

  it('should handle non-200 status codes', async () => {
    const mockGet = jest
      .fn()
      .mockResolvedValueOnce({
        message: { statusCode: 503 }
      })
      .mockResolvedValueOnce({
        message: { statusCode: 200 }
      })

    ;(httpm.HttpClient as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }))

    const result = await performHealthCheck('https://example.com', mockInputs)

    expect(result).toBe('healthy')
    expect(mockGet).toHaveBeenCalledTimes(2)
    expect(mockWarning).toHaveBeenCalledWith(expect.stringContaining('HTTP 503'))
  })
})

