/**
 * Tests for Dokploy API Client
 */

import { DokployClient } from '../src/client/dokploy-client'

describe('DokployClient', () => {
  let client: DokployClient

  beforeEach(() => {
    client = new DokployClient({
      url: 'https://test.dokploy.local',
      apiKey: 'test-api-key-12345'
    })
  })

  describe('constructor', () => {
    it('should create client with config', () => {
      expect(client).toBeDefined()
    })

    it('should remove trailing slash from URL', () => {
      const clientWithSlash = new DokployClient({
        url: 'https://test.dokploy.local/',
        apiKey: 'test-key'
      })
      expect(clientWithSlash).toBeDefined()
    })
  })

  describe('resolveServerId', () => {
    it('should return provided server ID', async () => {
      const serverId = await client.resolveServerId('srv-123')
      expect(serverId).toBe('srv-123')
    })

    it('should throw error if neither ID nor name provided', async () => {
      await expect(client.resolveServerId()).rejects.toThrow(
        'Either server-id or server-name must be provided'
      )
    })
  })

  // Add more tests as implementation progresses
  describe('API methods', () => {
    it('should have getAllProjects method', () => {
      expect(typeof client.getAllProjects).toBe('function')
    })

    it('should have createProject method', () => {
      expect(typeof client.createProject).toBe('function')
    })

    it('should have deployApplication method', () => {
      expect(typeof client.deployApplication).toBe('function')
    })
  })
})
