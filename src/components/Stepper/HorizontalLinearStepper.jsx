import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import { Alert, AlertTitle, Paper, Stack } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

export default function HorizontalLinearStepper({ activeStep, stepComponents, steps, processType }) {
  const [skipped, setSkipped] = React.useState(new Set())

  const isStepOptional = (step) => {
    return step === stepComponents.length
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Paper elevation={3} sx={{ p: 2 }}>
        <Stack>
          <Alert severity="info">
            <AlertTitle>{processType}</AlertTitle>
          </Alert>
          <br />
        </Stack>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </Paper>
      <LinearProgress variant="determinate" value={(activeStep / steps.length) * 100} />
      {stepComponents.map((item) => {
        return item
      })}
    </Box>
  )
}
