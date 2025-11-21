/**
 * Parse GitHub Action inputs
 */

import * as core from '@actions/core'
import type { ActionInputs } from './types/dokploy'
import {
  parseOptionalStringInput,
  parseIntInput,
  parseBooleanInput,
  parseCpuLimit,
  sanitizeSecret
} from './utils/helpers'

export function parseInputs(): ActionInputs {
  // Core configuration
  const dokployUrl = core.getInput('dokploy-url', { required: true })
  const apiKey = core.getInput('api-key', { required: true })
  const dockerImage = core.getInput('docker-image', { required: true })

  // Mask secrets
  sanitizeSecret(apiKey)
  const registryPassword = parseOptionalStringInput('registry-password')
  if (registryPassword) {
    sanitizeSecret(registryPassword)
  }

  return {
    // Core
    dokployUrl,
    apiKey,
    dockerImage,

    // Project & Environment
    projectId: parseOptionalStringInput('project-id'),
    projectName: parseOptionalStringInput('project-name'),
    projectDescription: parseOptionalStringInput('project-description'),
    environmentId: parseOptionalStringInput('environment-id'),
    environmentName: parseOptionalStringInput('environment-name') || 'production',
    autoCreateResources:
      parseBooleanInput(parseOptionalStringInput('auto-create-resources')) ?? true,

    // Application
    applicationId: parseOptionalStringInput('application-id'),
    applicationName: parseOptionalStringInput('application-name'),
    applicationTitle: parseOptionalStringInput('application-title'),
    applicationDescription: parseOptionalStringInput('application-description'),
    containerName: parseOptionalStringInput('container-name'),

    // Server
    serverId: parseOptionalStringInput('server-id'),
    serverName: parseOptionalStringInput('server-name') || 'Hostinger-Server1',

    // Resources
    memoryLimit: parseIntInput(parseOptionalStringInput('memory-limit'), 'memory-limit'),
    memoryReservation: parseIntInput(
      parseOptionalStringInput('memory-reservation'),
      'memory-reservation'
    ),
    cpuLimit: parseCpuLimit(parseOptionalStringInput('cpu-limit')),
    cpuReservation: parseCpuLimit(parseOptionalStringInput('cpu-reservation')),
    port: parseIntInput(parseOptionalStringInput('port'), 'port'),
    targetPort: parseIntInput(parseOptionalStringInput('target-port'), 'target-port'),
    restartPolicy: parseOptionalStringInput('restart-policy'),

    // Scaling
    replicas: parseIntInput(parseOptionalStringInput('replicas'), 'replicas'),
    minReplicas: parseIntInput(parseOptionalStringInput('min-replicas'), 'min-replicas'),
    maxReplicas: parseIntInput(parseOptionalStringInput('max-replicas'), 'max-replicas'),
    enableAutoScaling: parseBooleanInput(parseOptionalStringInput('enable-auto-scaling')),

    // Registry
    registryUrl: parseOptionalStringInput('registry-url') || 'ghcr.io',
    registryUsername: parseOptionalStringInput('registry-username'),
    registryPassword,

    // Environment Variables
    env: parseOptionalStringInput('env'),
    envFile: parseOptionalStringInput('env-file'),
    envFromJson: parseOptionalStringInput('env-from-json'),

    // Domain & SSL
    domainHost: parseOptionalStringInput('domain-host'),
    domainPath: parseOptionalStringInput('domain-path'),
    domainPort: parseIntInput(parseOptionalStringInput('domain-port'), 'domain-port'),
    domainHttps: parseBooleanInput(parseOptionalStringInput('domain-https')) ?? true,
    sslCertificateType: parseOptionalStringInput('ssl-certificate-type'),
    domainStripPath: parseBooleanInput(parseOptionalStringInput('domain-strip-path')),
    forceDomainRecreation: parseBooleanInput(
      parseOptionalStringInput('force-domain-recreation')
    ),

    // Deployment
    deploymentTitle: parseOptionalStringInput('deployment-title'),
    deploymentDescription: parseOptionalStringInput('deployment-description'),
    rollbackActive: parseBooleanInput(parseOptionalStringInput('rollback-active')),
    waitForDeployment:
      parseBooleanInput(parseOptionalStringInput('wait-for-deployment')) ?? true,
    deploymentTimeout: parseIntInput(
      parseOptionalStringInput('deployment-timeout'),
      'deployment-timeout'
    ),
    cleanupOldContainers: parseBooleanInput(parseOptionalStringInput('cleanup-old-containers')),

    // Health Check
    healthCheckEnabled:
      parseBooleanInput(parseOptionalStringInput('health-check-enabled')) ?? true,
    healthCheckUrl: parseOptionalStringInput('health-check-url'),
    healthCheckTimeout: parseIntInput(
      parseOptionalStringInput('health-check-timeout'),
      'health-check-timeout'
    ),
    healthCheckRetries: parseIntInput(
      parseOptionalStringInput('health-check-retries'),
      'health-check-retries'
    ),
    healthCheckInterval: parseIntInput(
      parseOptionalStringInput('health-check-interval'),
      'health-check-interval'
    ),

    // Debug
    debugMode: parseBooleanInput(parseOptionalStringInput('debug-mode')),
    logApiRequests: parseBooleanInput(parseOptionalStringInput('log-api-requests')),
    logApiResponses: parseBooleanInput(parseOptionalStringInput('log-api-responses'))
  }
}
