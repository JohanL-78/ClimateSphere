export default function SimpleAlert({ type = 'info', children, variant = 'dark' }) {
  const darkStyles = {
    info: {
      background: 'rgba(47, 111, 115, 0.16)',
      borderLeft: '4px solid var(--accent)',
      padding: '20px',
      color: 'var(--accent-soft)',
      margin: '24px 0',
      borderRadius: '0 8px 8px 0',
      backdropFilter: 'blur(5px)',
      border: '1px solid var(--border)',
      fontFamily: 'var(--font-body-stack)'
    },
    warning: {
      background: 'rgba(212, 169, 95, 0.12)',
      borderLeft: '4px solid #D4A95F',
      padding: '20px',
      color: '#D4A95F',
      margin: '24px 0',
      borderRadius: '0 8px 8px 0',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(212, 169, 95, 0.22)',
      fontFamily: 'var(--font-body-stack)'
    },
    error: {
      background: 'rgba(220, 53, 69, 0.1)',
      borderLeft: '4px solid #dc3545',
      padding: '20px',
      color: '#ff6b7a',
      margin: '24px 0',
      borderRadius: '0 8px 8px 0',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(220, 53, 69, 0.2)',
      fontFamily: 'var(--font-body-stack)'
    },
    success: {
      background: 'rgba(40, 167, 69, 0.1)',
      borderLeft: '4px solid #28a745',
      padding: '20px',
      color: '#4ade80',
      margin: '24px 0',
      borderRadius: '0 8px 8px 0',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(40, 167, 69, 0.2)',
      fontFamily: 'var(--font-body-stack)'
    }
  }

  const lightStyles = {
    info: {
      background: '#e6f7ff',
      borderLeft: '4px solid #1890ff',
      padding: '20px',
      color: '#0050b3',
      margin: '24px 0',
      borderRadius: '0 12px 12px 0',
      border: '1px solid #91d5ff',
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    warning: {
      background: '#fff7e6',
      borderLeft: '4px solid #fa8c16',
      padding: '20px',
      color: '#ad4e00',
      margin: '24px 0',
      borderRadius: '0 12px 12px 0',
      border: '1px solid #ffd591',
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    error: {
      background: '#fff2f0',
      borderLeft: '4px solid #ff4d4f',
      padding: '20px',
      color: '#a8071a',
      margin: '24px 0',
      borderRadius: '0 12px 12px 0',
      border: '1px solid #ffccc7',
      fontFamily: "system-ui, -apple-system, sans-serif"
    },
    success: {
      background: '#f6ffed',
      borderLeft: '4px solid #52c41a',
      padding: '20px',
      color: '#389e0d',
      margin: '24px 0',
      borderRadius: '0 12px 12px 0',
      border: '1px solid #b7eb8f',
      fontFamily: "system-ui, -apple-system, sans-serif"
    }
  }

  const styles = variant === 'light' ? lightStyles : darkStyles

  return (
    <div style={styles[type] || styles.info}>
      <strong style={{
        fontWeight: '700',
        fontSize: '14px',
        letterSpacing: '1px',
        marginRight: '8px'
      }}>
        [{type.toUpperCase()}]
      </strong>
      <span style={{ fontSize: '15px', lineHeight: '1.6' }}>
        {children}
      </span>
    </div>
  )
}
