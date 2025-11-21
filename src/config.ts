/**
 * Configuration builders for applications and domains
 */

import type { ActionInputs, Application, Domain } from './types/dokploy'

export function buildApplicationConfig(
  name: string,
  projectId: string,
  environmentId: string,
  serverId: string,
  inputs: ActionInputs
): Partial<Application> {
  const config: Partial<Application> = {
    name,
    projectId,
    environmentId,
    serverId,
    applicationStatus: 'idle',
    title: inputs.applicationTitle || name,
    description: inputs.applicationDescription || `Automated deployment: ${name}`,
    port: inputs.port || 8080,
    targetPort: inputs.targetPort || 8080,
    restartPolicy: inputs.restartPolicy || 'unless-stopped'
  }

  if (inputs.containerName) {
    config.appName = inputs.containerName
  }

  if (inputs.memoryLimit) {
    config.memoryLimit = inputs.memoryLimit
  }

  if (inputs.memoryReservation) {
    config.memoryReservation = inputs.memoryReservation
  }

  if (inputs.cpuLimit) {
    config.cpuLimit = inputs.cpuLimit
  }

  if (inputs.cpuReservation) {
    config.cpuReservation = inputs.cpuReservation
  }

  if (inputs.replicas) {
    config.replicas = inputs.replicas
  }

  return config
}

export function buildDomainConfig(inputs: ActionInputs): Partial<Domain> | null {
  if (!inputs.domainHost) {
    return null
  }

  const domainPort = inputs.domainPort || inputs.targetPort || 8080

  return {
    host: inputs.domainHost,
    path: inputs.domainPath || '/',
    port: domainPort,
    https: inputs.domainHttps !== false,
    certificateType: (inputs.sslCertificateType as 'letsencrypt' | 'custom' | 'none') || 'letsencrypt',
    domainType: 'application',
    stripPath: inputs.domainStripPath || false
  }
}

export function parseEnvironmentVariables(inputs: ActionInputs): string {
  // Priority: env-from-json > env-file > env

  // Try JSON format first
  if (inputs.envFromJson) {
    try {
      const obj = JSON.parse(inputs.envFromJson)
      return Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    } catch (error) {
      throw new Error(
        `Failed to parse env-from-json: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  // Use direct string format
  if (inputs.env) {
    return inputs.env
  }

  return ''
}
