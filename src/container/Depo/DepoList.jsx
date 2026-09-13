import { List, ListSubheader } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DepoContainer } from '../../store/DepoContainer'
import DepoItem from '../../components/DepoItem'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import useIsMobile from '../../hooks/useIsMobile'

export default function DepoList() {
  const isMobile = useIsMobile()
  const depoContainer = DepoContainer.useContainer()
  const navigate = useNavigate()
  const [depoList, setDepoList] = useState([])

  const handleListItemClick = (depoCode, depoName) => {
    depoContainer.handleDepoCode(depoCode)
    depoContainer.handleDepoCombo(depoCode)
    depoContainer.handleDepoName(depoName)

    isMobile ? navigate(`/d:${depoCode}`) : navigate(`/d:${depoCode}/dashboard`)
  }

  useEffect(() => {
    setDepoList(depoContainer.depoList)
  }, [depoContainer.depoList])

  return (
    <List
      key={1}
      sx={{ display: 'flow' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          DEPO SEÇİNİZ
        </ListSubheader>
      }
    >
      {depoList && depoList.length > 0 ? (
        depoList.map((todo) => <DepoItem key={todo.depoNo} todo={todo} depoCode={depoList.depoCode} handleListItemClick={handleListItemClick} />)
      ) : (
        <LoadingSpinner />
      )}
    </List>
  )
}
