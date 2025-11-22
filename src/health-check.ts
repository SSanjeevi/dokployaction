/**
 * Health check functionality
 */

import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import type { ActionInputs } from './types/dokploy'
import { sleep } from './utils/helpers'

export async function performHealthCheck(
  deploymentUrl: string,
  inputs: ActionInputs
): Promise<string> {
  if (inputs.healthCheckEnabled === false) {
    core.info('ℹ️ Health check disabled')
    return 'skipped'
  }

  if (!deploymentUrl) {
    core.warning('⚠️ No deployment URL available, skipping health check')
    return 'skipped'
  }

  const healthCheckPath = inputs.healthCheckPath || '/health'
  const timeout = inputs.healthCheckTimeout || 60
  const retries = inputs.healthCheckRetries || 3
  const interval = inputs.healthCheckInterval || 10

  const fullUrl = `${deploymentUrl}${healthCheckPath}`
  core.info(`🏥 Performing health check: ${fullUrl}`)
  core.info(`   Timeout: ${timeout}s, Retries: ${retries}, Interval: ${interval}s`)

  const client = new httpm.HttpClient('dokploy-health-check')
  const startTime = Date.now()

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      core.info(`🔍 Health check attempt ${attempt}/${retries}...`)

      const response = await client.get(fullUrl)
      const statusCode = response.message.statusCode || 0

      if (statusCode === 200) {
        core.info(`✅ Health check passed! (HTTP ${statusCode})`)
        return 'healthy'
      }

      core.warning(`⚠️ Health check returned HTTP ${statusCode}`)

      if (attempt < retries) {
        core.info(`⏳ Waiting ${interval}s before retry...`)
        await sleep(interval * 1000)
      }
    } catch (error) {
      core.warning(
        `⚠️ Health check failed: ${error instanceof Error ? error.message : String(error)}`
      )

      if (attempt < retries) {
        core.info(`⏳ Waiting ${interval}s before retry...`)
        await sleep(interval * 1000)
      }
    }

    // Check timeout
    const elapsed = (Date.now() - startTime) / 1000
    if (elapsed >= timeout) {
      core.error(`❌ Health check timeout after ${elapsed}s`)
      return 'unhealthy'
    }
  }

  core.error(`❌ Health check failed after ${retries} attempts`)
  return 'unhealthy'
}
