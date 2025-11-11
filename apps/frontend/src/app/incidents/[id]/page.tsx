'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Event {
  id: number
  service: string
  level: string
  message: string
  timestamp: string
}

interface IncidentDetail {
  id: number
  service: string
  category: string | null
  severity: string | null
  summary: string | null
  recommended_actions: string[]
  status: string
  created_at: string
  updated_at: string
  events: Event[]
}

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [incident, setIncident] = useState<IncidentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchIncidentDetail(params.id as string)
    }
  }, [params.id])

  const fetchIncidentDetail = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/incidents/${id}`)
      setIncident(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching incident:', err)
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!incident) return
    
    setUpdating(true)
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/incidents/${incident.id}/status`, {
        status: newStatus
      })
      setIncident({ ...incident, status: newStatus })
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200'
      case 'P2': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'P3': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'investigating': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR': return 'bg-red-100 text-red-800'
      case 'WARNING': return 'bg-yellow-100 text-yellow-800'
      case 'INFO': return 'bg-blue-100 text-blue-800'
      case 'DEBUG': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Incident not found</h3>
        <p className="mt-2 text-sm text-gray-500">The incident you're looking for doesn't exist.</p>
        <Link href="/incidents" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          ← Back to incidents
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/incidents"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Incident #{incident.id}</h2>
            <p className="text-gray-600 mt-1">
              Created {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="mt-1 text-sm text-gray-900">{incident.service}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                  {incident.status}
                </span>
              </div>

              {incident.category && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1 text-sm text-gray-900">{incident.category}</p>
                </div>
              )}

              {incident.severity && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Severity</p>
                  <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </div>
              )}
            </div>

            {incident.summary && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-500">Summary</p>
                <p className="mt-2 text-sm text-gray-700">{incident.summary}</p>
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          {incident.recommended_actions && incident.recommended_actions.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Recommended Actions</h3>
              <ul className="space-y-3">
                {incident.recommended_actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{action}</p>
                      <button className="mt-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                        Execute Action
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Events */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Events ({incident.events.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {incident.events.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(event.level)}`}>
                          {event.level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 font-mono">{event.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {incident.status === 'open' && (
                <button
                  onClick={() => updateStatus('investigating')}
                  disabled={updating}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  Start Investigation
                </button>
              )}
              
              {incident.status === 'investigating' && (
                <button
                  onClick={() => updateStatus('resolved')}
                  disabled={updating}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
              )}
              
              {incident.status === 'resolved' && (
                <button
                  onClick={() => updateStatus('closed')}
                  disabled={updating}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  Close Incident
                </button>
              )}

              {incident.status !== 'open' && incident.status !== 'closed' && (
                <button
                  onClick={() => updateStatus('open')}
                  disabled={updating}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Reopen
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(incident.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(incident.updated_at), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}