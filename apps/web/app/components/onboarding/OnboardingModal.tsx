'use client'

import React from 'react'
import { useRoleContext } from '../../context/RoleContext'
import { useRegionContext } from '../../context/RegionContext'

const ONBOARDED_KEY = 'rdi-onboarded'

export function OnboardingModal() {
  const { role, setRole } = useRoleContext()
  const { region, setRegion } = useRegionContext()
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const totalSteps = 4

  React.useEffect(() => {
    try {
      const done = window.localStorage.getItem(ONBOARDED_KEY)
      if (done !== '1') setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [])

  const closeAndPersist = React.useCallback(() => {
    try {
      window.localStorage.setItem(ONBOARDED_KEY, '1')
    } catch {}
    setOpen(false)
  }, [])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeAndPersist} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg border border-gray-200">
        <div className="px-6 pt-6 pb-3 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Welcome</h2>
            <span className="text-xs text-gray-500">{step}/{totalSteps}</span>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          {step === 1 ? (
            <>
              <p className="text-sm text-gray-600">Let’s personalize your dashboard. We’ll ask a few quick questions.</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Select your role</li>
                <li>Choose your region</li>
                <li>Confirm and finish</li>
              </ul>
            </>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Select your role</div>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" name="role" value="analyst" checked={role === 'analyst'} onChange={() => setRole('analyst')} />
                  Analyst
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="radio" name="role" value="citizen" checked={role === 'citizen'} onChange={() => setRole('citizen')} />
                  Citizen
                </label>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="region-input">Your region</label>
              <input
                id="region-input"
                value={region}
                onChange={(e) => setRegion(e.currentTarget.value.toLowerCase())}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-brand"
                placeholder="e.g. gasabo"
              />
              <p className="text-xs text-gray-500 mt-2">Tip: Start with "gasabo" for best demo coverage.</p>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-700">You’re all set. Preferences:</div>
              <div className="text-sm text-gray-600">Role: <span className="font-medium">{role}</span></div>
              <div className="text-sm text-gray-600">Region: <span className="font-medium">{region || 'gasabo'}</span></div>
              <div className="text-xs text-gray-400">You can change these anytime from the header.</div>
            </div>
          ) : null}
        </div>
        <div className="px-6 pb-6 pt-3 border-t flex items-center justify-between">
          <button type="button" className="text-sm text-gray-500 hover:text-gray-700" onClick={closeAndPersist}>
            Skip
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sm px-3 py-2 rounded border border-gray-200 hover:bg-gray-50"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="text-sm px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={closeAndPersist}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



