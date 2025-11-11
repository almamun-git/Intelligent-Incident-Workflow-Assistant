'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Incident {
  id: number
  service: string
  category: string | null
  severity: string | null
  summary: string | null
  status: string
  created_at: string
  event_count: number
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchIncidents()
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredIncidents(incidents)
    } else {
      setFilteredIncidents(incidents.filter(i => i.status === statusFilter))
    }
  }, [statusFilter, incidents])

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/incidents`)
      setIncidents(response.data)
      setFilteredIncidents(response.data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching incidents:', err)
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Incidents</h2>
          <p className="text-gray-600 mt-1">View and manage all incidents</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['all', 'open', 'investigating', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  statusFilter === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === 'all' && ` (${incidents.length})`}
                {status !== 'all' && ` (${incidents.filter(i => i.status === status).length})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Incidents List */}
        <div className="divide-y divide-gray-200">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === 'all' 
                  ? 'No incidents have been created yet.'
                  : `No incidents with status "${statusFilter}".`
                }
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div key={incident.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Incident #{incident.id}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                      {incident.severity && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Service:</span> {incident.service}
                      </p>
                      {incident.category && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Category:</span> {incident.category}
                        </p>
                      )}
                      {incident.summary && (
                        <p className="text-sm text-gray-700 mt-2">{incident.summary}</p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {incident.event_count} events
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/incidents/${incident.id}`}
                    className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}