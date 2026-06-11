'use client'

import { useEffect, useState } from 'react'

export default function Chart({ type, data, xKey, yKey, nameKey, valueKey, title, locale = 'en' }) {
  const [isClient, setIsClient] = useState(false)
  const [RechartsComponents, setRechartsComponents] = useState(null)
  const labels = locale === 'fr'
    ? {
        loading: 'Chargement du graphique...',
        error: 'Erreur de chargement des graphiques...',
        noData: 'Aucune donnee a afficher',
        unsupported: 'Type de graphique non supporte'
      }
    : {
        loading: 'Loading chart...',
        error: 'Chart loading error...',
        noData: 'No data to display',
        unsupported: 'Unsupported chart type'
      }

  useEffect(() => {
    setIsClient(true)
    // Import Recharts only on client side
    import('recharts').then((recharts) => {
      setRechartsComponents(recharts)
    })
  }, [])

  if (!isClient) {
    return (
      <div style={{
        width: '100%',
        height: '384px',
        margin: '32px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(246, 241, 232, 0.035)',
        color: 'var(--foreground-muted)',
        borderRadius: '8px'
      }}>
        <div>
          {title && <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h3>}
          <p>{labels.loading}</p>
        </div>
      </div>
    )
  }

  if (!RechartsComponents) {
    return (
      <div style={{
        width: '100%',
        height: '384px',
        margin: '32px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(212, 169, 95, 0.12)',
        color: '#D4A95F',
        borderRadius: '8px'
      }}>
        <div>
          {title && <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>{title}</h3>}
          <p>{labels.error}</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '384px',
        margin: '32px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(246, 241, 232, 0.035)',
        color: 'var(--foreground-muted)',
        borderRadius: '8px'
      }}>
        {labels.noData}
      </div>
    )
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } = RechartsComponents
  const COLORS = ['var(--accent-soft)', '#D4A95F', '#C56F4B', 'var(--foreground-soft)', 'var(--accent)', 'var(--foreground-muted)']

  const containerStyle = {
    width: '100%',
    height: '384px',
    margin: '32px 0',
    background: 'rgba(246, 241, 232, 0.035)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    padding: '24px'
  }

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-display-stack)',
    letterSpacing: '0'
  }

  switch (type) {
    case 'line':
      return (
        <div style={containerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(246, 241, 232, 0.09)" />
              <XAxis dataKey={xKey} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background-deep)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--foreground)'
                }}
              />
              <Legend
                wrapperStyle={{ color: 'var(--foreground-muted)' }}
              />
              <Line type="monotone" dataKey={yKey} stroke="var(--accent-soft)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )

    case 'bar':
      return (
        <div style={containerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(246, 241, 232, 0.09)" />
              <XAxis dataKey={xKey} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background-deep)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--foreground)'
                }}
              />
              <Legend
                wrapperStyle={{ color: 'var(--foreground-muted)' }}
              />
              <Bar dataKey={yKey} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )

    case 'pie':
      return (
        <div style={containerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="var(--accent)"
                dataKey={valueKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelStyle={{ fill: 'var(--foreground-muted)', fontSize: 12 }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background-deep)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--foreground)'
                }}
              />
              <Legend
                wrapperStyle={{ color: 'var(--foreground-muted)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )

    default:
      return (
        <div style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(246, 241, 232, 0.035)',
          color: 'var(--foreground-muted)',
          borderRadius: '8px'
        }}>
          {labels.unsupported}: {type}
        </div>
      )
  }
}
