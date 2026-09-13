import { Avatar, Card, CardHeader } from '@mui/material'
import { red } from '@mui/material/colors'
import React from 'react'

export default function OrderHeaderCard({ firmName }) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {firmName.slice(0, 1)}
          </Avatar>
        }
        title={firmName}
      />
    </Card>
  )
}
