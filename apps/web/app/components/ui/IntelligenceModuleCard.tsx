import React from 'react'
import { AlertCircle, Clock, Target, User, Zap, ArrowRight } from 'lucide-react'
import type { IntelligenceModule } from '../../types/api'

const trendColor: Record<string, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  stable: 'text-gray-600'
}

const impactBadge: Record<string, string> = {
  high: 'bg-red-50 text-red-600 border border-red-100',
  medium: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
  low: 'bg-gray-100 text-gray-600 border border-gray-200'
}

export function IntelligenceModuleCard({ module }: { module: IntelligenceModule }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Intelligence Module</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{module.title}</h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <User className="w-4 h-4" />
            Designed for {module.persona}
          </p>
        </div>
        <div className="text-right">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
            <Target className="w-4 h-4 text-blue-500" />
            {module.objective}
          </p>
        </div>
      </header>

      {/* Primary insight */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-semibold">Actionable Insight</p>
        <p className="text-sm text-blue-800 mt-2 leading-6">{module.insight}</p>
      </section>

      {/* Summary and narrative */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-medium">Timeframe:</span>
          <span>{module.timeframe}</span>
          <span className="mx-2">•</span>
          <span className="font-medium">Confidence:</span>
          <span className="capitalize">{module.confidence}</span>
        </div>
        <p className="text-sm text-gray-700 leading-6">{module.summary}</p>
        <ul className="space-y-2">
          {module.narrative.map((line, idx) => (
            <li key={idx} className="text-sm text-gray-600 leading-6 flex gap-2">
              <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Signals */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Zap className="w-4 h-4 text-amber-500" />
          Key Signals
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {module.keySignals.map((signal) => (
            <div key={signal.label} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-800">{signal.label}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wide ${impactBadge[signal.impact] || impactBadge.low}`}>
                  {signal.impact} impact
                </span>
              </div>
              <p className={`text-lg font-semibold ${trendColor[signal.trend] || 'text-gray-900'}`}>{signal.value}</p>
              <p className="text-xs text-gray-500 mt-2 leading-4">{signal.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended actions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <AlertCircle className="w-4 h-4 text-emerald-500" />
          Recommended Actions
        </div>
        <div className="space-y-2">
          {module.recommendedActions.map((action) => (
            <button
              key={action.id}
              className="w-full text-left border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              type="button"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-gray-900">{action.label}</p>
                <span className="text-xs uppercase tracking-wide text-blue-600">{action.intent}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-5">{action.description}</p>
            </button>
          ))}
        </div>
      </section>

      {module.supportingEvidence && module.supportingEvidence.length > 0 && (
        <section className="space-y-2">
          <p className="text-sm font-semibold text-gray-800">Supporting Intelligence</p>
          <ul className="space-y-2">
            {module.supportingEvidence.map((evidence, idx) => (
              <li key={`${evidence.label}-${idx}`} className="text-sm text-gray-600 leading-5">
                <span className="font-semibold text-gray-800">{evidence.label}:</span>{' '}
                <span>{evidence.value}</span>
                {evidence.source && <span className="text-xs text-gray-400 block mt-1">Source: {evidence.source}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

