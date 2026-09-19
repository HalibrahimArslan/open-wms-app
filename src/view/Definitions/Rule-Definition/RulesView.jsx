import React from 'react'
import Seo from '../../../shared/components/Seo'
import { Box } from '@mui/material'
import RuleContainer from '../../../container/Definitions/Mail-Definition/RuleContainer'

const RulesView = () => {
  return (
    <>
      <Seo title="Kurallar" />
      <Box
        sx={{
          boxShadow: 2,
        }}
      >
        <RuleContainer />
      </Box>
    </>
  )
}

export default RulesView
