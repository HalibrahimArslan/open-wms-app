import * as React from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

/**
 * Reusable split button (fixed primary action + dropdown actions).
 *
 * primary: { label: string, icon?: ReactNode, onClick: () => void, disabled?: boolean }
 * options: [{ label: string, icon?: ReactNode, onClick: () => void, disabled?: boolean }]
 */
export default function SplitButton({ primary, options, variant = 'outlined', color = 'primary', size = 'small', disabled = false, ariaLabel = 'actions', buttonGroupSx, menuSx }) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const safeOptions = Array.isArray(options) ? options : []

  const handleClick = () => {
    if (!primary?.onClick) return
    primary.onClick()
  }

  const handleToggle = () => {
    if (disabled) return
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const handleMenuItemClick = (event, option) => {
    option?.onClick?.()
    setOpen(false)
  }

  if (!primary) return null

  return (
    <>
      <ButtonGroup variant={variant} color={color} size={size} ref={anchorRef} aria-label={ariaLabel} disabled={disabled} sx={buttonGroupSx}>
        <Button onClick={handleClick} disabled={disabled || Boolean(primary?.disabled)} startIcon={primary?.icon || undefined}>
          {primary?.label}
        </Button>
        <Button
          size={size}
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select action"
          aria-haspopup="menu"
          onClick={handleToggle}
          disabled={disabled}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper sx={{ zIndex: 1 }} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="bottom-end">
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {safeOptions.map((option, index) =>
                    option?.type === 'divider' ? (
                      <Divider key={`divider-${index}`} />
                    ) : (
                      <MenuItem
                        key={`${option.label}-${index}`}
                        onClick={(event) => handleMenuItemClick(event, option)}
                        disabled={disabled || Boolean(option.disabled)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          ...(option.variant === 'info'
                            ? {
                                opacity: 0.9,
                                fontSize: '12px',
                                '&.Mui-disabled': { opacity: 1 },
                              }
                            : {}),
                          ...menuSx,
                        }}
                      >
                        {option.icon || null}
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
