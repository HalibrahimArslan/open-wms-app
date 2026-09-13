import { Box, Paper } from '@mui/material'
import RenderMenuTree from '../../container/MenuTree/RenderMenuTree'
import useDepoCode from '../../hooks/useDepoCode'

const glassEffect = {
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 23,
  pointerEvents: 'none',
}

const Sidebar = () => {
  const depoCode = useDepoCode()

  return <RenderMenuTree />
}

export default Sidebar
