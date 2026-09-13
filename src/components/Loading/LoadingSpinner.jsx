import React from 'react'
import { CircularProgress, Box, Typography, Modal } from '@mui/material'

export default function LoadingSpinner({ text }) {
  return (
    <Modal open={true}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CircularProgress size={64} thickness={4} />
          <Typography>{text}</Typography>
        </div>
      </div>
    </Modal>
  )
}
