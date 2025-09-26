"use client"
import React from 'react'
import { Header } from '../components/layout/Header'
import { MainContent } from '../components/layout/MainContent'
import { FloatingAIAssistant } from '../components/ui/FloatingAIAssistant'
import { useRegionContext } from '../context/RegionContext'
import { useEntrepreneur } from '../hooks/useEntrepreneur'
import type { EntrepreneurIntelligenceResponse } from '../types/api'

function formatCurrency(amount: number) {
  if (!amount) return 'RWF 0'
  return `RWF ${(amount / 1_000_000).toFixed(1)}M`
}

export default function EntrepreneurPage() {
  const { region } = useRegionContext()
  const { data, isLoading, error } = useEntrepreneur(region)

  return (
    <main className="min-h-screen">
      <Header />
      <div>
        <MainContent>
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold">Investment Intelligence Engine</h1>
            <p className="text-sm text-gray-600 max-w-3xl">
              Guided workflow that matches Rwanda's development priorities with investor profiles, due diligence signals, and
              government execution pathways. Turn static underserved metrics into an actionable opportunity stream.
            </p>
          </header>

          {isLoading ? (
            <div className="mt-6 space-y-3">
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-32 bg-gray-100 rounded animate-pulse" />
            </div>
          ) : error ? (
            <div className="mt-6 text-sm text-red-600">{error.message}</div>
          ) : data ? (
            <EntrepreneurIntelligenceView intelligence={data} />
          ) : null}
        </MainContent>
      </div>
      <FloatingAIAssistant />
    </main>
  )
}

function EntrepreneurIntelligenceView({ intelligence }: { intelligence: EntrepreneurIntelligenceResponse }) {
  const { profile, summary, keySignals, buckets, dueDiligenceHighlights, recommendedNextSteps, governmentContacts, investorNetwork } = intelligence

  return (
    <div className="mt-8 space-y-8">
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <p className="text-xs uppercase text-blue-700 font-semibold">Investment Profile</p>
          <p className="text-lg font-semibold text-blue-900 mt-2">{formatCurrency(profile.capital)} deployable</p>
          <dl className="mt-3 text-sm text-blue-900 space-y-1">
            <div className="flex justify-between"><dt>Sector focus</dt><dd className="font-medium capitalize">{profile.sector}</dd></div>
            <div className="flex justify-between"><dt>Risk tolerance</dt><dd className="font-medium capitalize">{profile.risk}</dd></div>
            <div className="flex justify-between"><dt>Timeline</dt><dd className="font-medium">{profile.timeline} months</dd></div>
            <div className="flex justify-between"><dt>Region</dt><dd className="font-medium capitalize">{profile.region}</dd></div>
          </dl>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <p className="text-sm text-gray-600 leading-6">{summary}</p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {keySignals.map((signal) => (
              <div key={signal.label} className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">{signal.label}</p>
                <p className="text-lg font-semibold mt-2 text-gray-900">{signal.value}</p>
                <p className="text-xs text-gray-500 mt-2 leading-4">{signal.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <header className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Opportunity Buckets</h2>
            <p className="text-sm text-gray-600">Curated pipelines ordered by confidence, ROI, and policy fit.</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Generate Investment Brief
          </button>
        </header>

        <div className="space-y-6">
          {buckets.map((bucket) => (
            <BucketCard key={bucket.id} bucket={bucket} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">Due Diligence Highlights</h3>
          <ul className="mt-4 space-y-3">
            {dueDiligenceHighlights.map((item) => (
              <li key={item.label} className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                <p className="text-sm text-gray-700 mt-1 leading-5">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Recommended Next Steps</h3>
          <ul className="mt-4 space-y-3">
            {recommendedNextSteps.map((step) => (
              <li key={step.id} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">{step.label}</p>
                <p className="text-xs text-gray-600 mt-1 leading-4">{step.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Government Execution Network</h3>
          <ul className="mt-4 space-y-3">
            {governmentContacts.map((contact) => (
              <li key={contact.email} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.title} • {contact.ministry}</p>
                <p className="text-xs text-blue-600 mt-1">{contact.email}</p>
                {contact.phone ? <p className="text-xs text-gray-500">{contact.phone}</p> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Investor Network</h3>
          <ul className="mt-4 space-y-3">
            {investorNetwork.map((investor) => (
              <li key={investor.name} className="border border-gray-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900">{investor.name}</p>
                <p className="text-xs text-gray-500">{investor.stage} • {investor.focus}</p>
                {investor.contact ? <p className="text-xs text-blue-600 mt-1">{investor.contact}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function BucketCard({ bucket }: { bucket: EntrepreneurIntelligenceResponse['buckets'][number] }) {
  return (
    <article className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">{bucket.title}</p>
        <p className="text-sm text-gray-600 mt-1 leading-5">{bucket.narrative}</p>
      </header>

      <div className="space-y-4">
        {bucket.opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </article>
  )
}

function OpportunityCard({ opportunity }: { opportunity: EntrepreneurIntelligenceResponse['buckets'][number]['opportunities'][number] }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold text-gray-900">{opportunity.name}</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{opportunity.district}</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-gray-900">{formatCurrency(opportunity.investmentRequired)}</p>
          <p className="text-xs text-gray-500">Payback {opportunity.paybackMonths} months • ROI {opportunity.roi}%</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-3 leading-5">{opportunity.summary}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">Impact Narrative</p>
          <p className="text-sm text-gray-700 mt-1 leading-5">{opportunity.impactNarrative}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">Due Diligence Snapshot</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            <li>{opportunity.dueDiligence.marketSize}</li>
            <li>{opportunity.dueDiligence.regulation}</li>
            <li>{opportunity.dueDiligence.incentives}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full">Match score {opportunity.matchScore}%</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">{opportunity.riskProfile} risk</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Timeline {opportunity.timelineMonths} months</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">{opportunity.confidence} confidence</span>
      </div>

      <div className="mt-4 space-y-2">
        {opportunity.actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="w-full text-left border border-gray-200 rounded-lg px-4 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900">{action.label}</p>
            <p className="text-xs text-gray-600 mt-1 leading-4">{action.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-900">Government Liaison</p>
        <p>{opportunity.governmentContact.name} • {opportunity.governmentContact.title}</p>
        <p className="text-blue-600">{opportunity.governmentContact.email}</p>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p className="font-semibold text-gray-900">Supporting Intelligence</p>
        <ul className="mt-1 list-disc list-inside space-y-1">
          {opportunity.supportingData.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

