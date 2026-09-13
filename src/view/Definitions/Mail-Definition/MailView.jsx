import React from 'react'
import Seo from '../../../shared/components/Seo'
import MailContainer from '../../../container/Definitions/Mail-Definition/MailContainer'
import { Box } from '@mui/material'

const MailView = () => {
  return (
    <>
      <Seo title="Mailler" />
      <Box boxShadow={2}>
        <MailContainer />
      </Box>
    </>
  )
}

export default MailView
