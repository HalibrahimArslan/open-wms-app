import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Paper, useTheme } from '@mui/material'
import { tabsClasses } from '@mui/material/Tabs'

export default function AurTabs({ section, sectionPanel, scrollButtonEnable, tabValue }) {
  const theme = useTheme()
  const [value, setValue] = React.useState(tabValue ? tabValue : '1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        width: '100%',
        typography: 'body1',
        position: 'relative',
        marginTop: '2rem',
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Paper elevation={3}>
            <TabList
              aria-label="lab API tabs example"
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={scrollButtonEnable}
              allowScrollButtonsMobile={scrollButtonEnable}
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: 'auto',
                maxWidth: '100%',
                [`& .${tabsClasses.scrollButtons}`]: {
                  '&.Mui-disabled': { opacity: 0.3 },
                },

                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              {section?.map((tabItem) => (
                <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
              ))}
            </TabList>
          </Paper>
        </Box>
        {sectionPanel?.map((tabPanelItem) => (
          <TabPanel key={tabPanelItem.value} value={tabPanelItem.value} sx={{ marginTop: 4, padding: theme.spacing(0, 2) }}>
            {tabPanelItem.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}
