/**
 * Tests for input validators
 */

import {
  validateMemory,
  validateCpu,
  validateDnsName,
  validatePort,
  validateReplicas,
  validateDomainHost,
  validateDockerImage,
  validateAllInputs,
  ValidationError
} from '../validators'

describe('validators', () => {
  describe('validateMemory', () => {
    it('should accept valid memory values', () => {
      expect(() => validateMemory(4, 'memory-limit')).not.toThrow()
      expect(() => validateMemory(128, 'memory-limit')).not.toThrow()
      expect(() => validateMemory(1024, 'memory-limit')).not.toThrow()
    })

    it('should reject memory below 4MB', () => {
      expect(() => validateMemory(1, 'memory-limit')).toThrow(ValidationError)
      expect(() => validateMemory(2, 'memory-limit')).toThrow(ValidationError)
      expect(() => validateMemory(3, 'memory-limit')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validateMemory(undefined, 'memory-limit')).not.toThrow()
    })
  })

  describe('validateCpu', () => {
    it('should accept valid CPU values', () => {
      expect(() => validateCpu(0.001, 'cpu-limit')).not.toThrow()
      expect(() => validateCpu(0.1, 'cpu-limit')).not.toThrow()
      expect(() => validateCpu(1.0, 'cpu-limit')).not.toThrow()
      expect(() => validateCpu(2.5, 'cpu-limit')).not.toThrow()
    })

    it('should reject CPU below 0.001', () => {
      expect(() => validateCpu(0.0001, 'cpu-limit')).toThrow(ValidationError)
      expect(() => validateCpu(1e-9, 'cpu-limit')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validateCpu(undefined, 'cpu-limit')).not.toThrow()
    })
  })

  describe('validateDnsName', () => {
    it('should accept valid DNS names', () => {
      expect(() => validateDnsName('app', 'application-name')).not.toThrow()
      expect(() => validateDnsName('my-app', 'application-name')).not.toThrow()
      expect(() => validateDnsName('app123', 'application-name')).not.toThrow()
      expect(() => validateDnsName('a', 'application-name')).not.toThrow()
    })

    it('should reject invalid DNS names', () => {
      expect(() => validateDnsName('App', 'application-name')).toThrow(ValidationError) // uppercase
      expect(() => validateDnsName('-app', 'application-name')).toThrow(ValidationError) // starts with hyphen
      expect(() => validateDnsName('app-', 'application-name')).toThrow(ValidationError) // ends with hyphen
      expect(() => validateDnsName('app_name', 'application-name')).toThrow(ValidationError) // underscore
      expect(() => validateDnsName('app.name', 'application-name')).toThrow(ValidationError) // dot
    })

    it('should reject names longer than 63 characters', () => {
      const longName = 'a'.repeat(64)
      expect(() => validateDnsName(longName, 'application-name')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validateDnsName(undefined, 'application-name')).not.toThrow()
    })
  })

  describe('validatePort', () => {
    it('should accept valid ports', () => {
      expect(() => validatePort(80, 'port')).not.toThrow()
      expect(() => validatePort(443, 'port')).not.toThrow()
      expect(() => validatePort(3000, 'port')).not.toThrow()
      expect(() => validatePort(8080, 'port')).not.toThrow()
    })

    it('should reject invalid ports', () => {
      expect(() => validatePort(0, 'port')).toThrow(ValidationError)
      expect(() => validatePort(-1, 'port')).toThrow(ValidationError)
      expect(() => validatePort(65536, 'port')).toThrow(ValidationError)
      expect(() => validatePort(100000, 'port')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validatePort(undefined, 'port')).not.toThrow()
    })
  })

  describe('validateReplicas', () => {
    it('should accept valid replica counts', () => {
      expect(() => validateReplicas(0, 'replicas')).not.toThrow()
      expect(() => validateReplicas(1, 'replicas')).not.toThrow()
      expect(() => validateReplicas(5, 'replicas')).not.toThrow()
    })

    it('should reject negative replicas', () => {
      expect(() => validateReplicas(-1, 'replicas')).toThrow(ValidationError)
      expect(() => validateReplicas(-5, 'replicas')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validateReplicas(undefined, 'replicas')).not.toThrow()
    })
  })

  describe('validateDomainHost', () => {
    it('should accept valid domain hosts', () => {
      expect(() => validateDomainHost('example.com', 'domain-host')).not.toThrow()
      expect(() => validateDomainHost('app.example.com', 'domain-host')).not.toThrow()
      expect(() => validateDomainHost('api.subdomain.example.com', 'domain-host')).not.toThrow()
    })

    it('should reject invalid domain hosts', () => {
      expect(() => validateDomainHost('invalid', 'domain-host')).toThrow(ValidationError)
      expect(() => validateDomainHost('invalid_domain.com', 'domain-host')).toThrow(ValidationError)
      expect(() => validateDomainHost('http://example.com', 'domain-host')).toThrow(ValidationError)
    })

    it('should accept undefined (optional)', () => {
      expect(() => validateDomainHost(undefined, 'domain-host')).not.toThrow()
    })
  })

  describe('validateDockerImage', () => {
    it('should accept valid Docker images', () => {
      expect(() => validateDockerImage('nginx:latest', 'docker-image')).not.toThrow()
      expect(() => validateDockerImage('ghcr.io/user/app:v1.0.0', 'docker-image')).not.toThrow()
      expect(() => validateDockerImage('registry.io/org/repo:tag', 'docker-image')).not.toThrow()
    })

    it('should reject invalid Docker images', () => {
      expect(() => validateDockerImage('', 'docker-image')).toThrow(ValidationError)
      expect(() => validateDockerImage(undefined, 'docker-image')).toThrow(ValidationError)
      expect(() => validateDockerImage('invalid', 'docker-image')).toThrow(ValidationError)
      expect(() => validateDockerImage('no-tag-here', 'docker-image')).toThrow(ValidationError)
    })
  })

  describe('validateAllInputs', () => {
    it('should validate all inputs successfully', () => {
      const validInputs = {
        dockerImage: 'nginx:latest',
        applicationName: 'my-app',
        projectName: 'my-project',
        environmentName: 'production',
        memoryLimit: 128,
        memoryReservation: 64,
        cpuLimit: 1.0,
        cpuReservation: 0.5,
        port: 8080,
        targetPort: 3000,
        applicationPort: 80,
        replicas: 2,
        domainHost: 'app.example.com'
      }

      expect(() => validateAllInputs(validInputs)).not.toThrow()
    })

    it('should collect multiple validation errors', () => {
      const invalidInputs = {
        dockerImage: 'invalid',
        applicationName: 'Invalid_Name',
        memoryLimit: 2, // Too low
        cpuLimit: 0.0001, // Too low
        port: 100000 // Too high
      }

      expect(() => validateAllInputs(invalidInputs)).toThrow()
    })

    it('should accept minimal valid inputs', () => {
      const minimalInputs = {
        dockerImage: 'nginx:latest'
      }

      expect(() => validateAllInputs(minimalInputs)).not.toThrow()
    })
  })
})
