/**
 * Set GitHub Action outputs
 */

import * as core from '@actions/core'

export function setOutputs(outputs: Record<string, string>): void {
  Object.entries(outputs).forEach(([key, value]) => {
    if (value) {
      core.setOutput(key, value)
    }
  })
}
