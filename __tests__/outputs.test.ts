/**
 * Tests for output setting
 */

import * as core from '@actions/core'
import { setOutputs } from '../src/outputs'

// Mock @actions/core
jest.mock('@actions/core')

describe('setOutputs', () => {
  const mockSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set outputs for provided values', () => {
    const outputs = {
      'application-id': 'app-123',
      'project-id': 'proj-456',
      'deployment-status': 'success'
    }

    setOutputs(outputs)

    expect(mockSetOutput).toHaveBeenCalledWith('application-id', 'app-123')
    expect(mockSetOutput).toHaveBeenCalledWith('project-id', 'proj-456')
    expect(mockSetOutput).toHaveBeenCalledWith('deployment-status', 'success')
    expect(mockSetOutput).toHaveBeenCalledTimes(3)
  })

  it('should skip empty values', () => {
    const outputs = {
      'application-id': 'app-123',
      'project-id': '',
      'deployment-status': 'success'
    }

    setOutputs(outputs)

    expect(mockSetOutput).toHaveBeenCalledWith('application-id', 'app-123')
    expect(mockSetOutput).toHaveBeenCalledWith('deployment-status', 'success')
    expect(mockSetOutput).toHaveBeenCalledTimes(2)
  })

  it('should handle empty outputs object', () => {
    setOutputs({})

    expect(mockSetOutput).not.toHaveBeenCalled()
  })
})

