import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { createContainer } from 'unstated-next'
import useAuthHeader from '../hooks/useAuthHeader'
import { getUserCompanyCode, getUserCompanyInfo } from '../services/MikroService'
import usePersistedToken from '../hooks/usePersistedToken'
import { useSWRConfig } from 'swr'
import { getAuthorities, getUserAuthorities } from '../services/AccountService'
import useFetchCompany from '../hooks/useFetchCompany'
import { getWarehouses } from '../services/WarehouseService'
import { getUsers } from '../services/UserService'

export const useStore = () => {
  const token = usePersistedToken()
  const location = useLocation()
  const { cache } = useSWRConfig()
  useFetchCompany()

  const headers = useAuthHeader()
  const [depoList, setDepoList] = useState([])
  const [depoCode, setDepoCode] = useState(1)
  const [depoName, setDepoName] = useState('')
  const [depoCombo, setDepoCombo] = useState(0)
  const [companyInfo, setCompanyInfo] = useState('')
  const [companyCode, setCompanyCode] = useState(0)
  const [isPressedLeftDrawer, setIsPressedLeftDrawer] = useState(false)
  const [isDepoMenuOpen, setDepoMenuOpen] = useState(false)
  const [authorityList, setAuthorityList] = useState([])
  const [userAuthorityList, setUserAuthorityList] = useState([])

  const [allDepoList, setAllDepoList] = useState([])
  const [userList, setUserList] = useState([])
  const [warehouseList, setWarehouseList] = useState([])

  const handleDepoCode = (index) => {
    setDepoCode(index)
  }
  const handleDepoName = (index) => {
    setDepoName(index)
  }

  const handleDepoCombo = (index) => {
    setDepoCombo(index)
  }

  const handleCompanyInfo = (index) => {
    setCompanyInfo(index)
  }

  const handleDepoAllList = (index) => {
    setAllDepoList(index)
  }

  const handleIsPressedLeftDrawer = (index) => {
    setIsPressedLeftDrawer(index)
  }

  const handleAuthorityList = (index) => {
    setAuthorityList(index)
  }

  const handleDepoMenu = (value) => {
    setDepoMenuOpen(value)
  }

  const fetchCompanyData = async () => {
    const res = await getUserCompanyInfo(headers)
    res && handleCompanyInfo(res)
  }

  const fetchCompanyCode = async () => {
    const res = await getUserCompanyCode(headers)
    if (res) {
      setCompanyCode(res)
      await fetchWarehouses(res)
    }
  }

  const fetchAuthorityList = async () => {
    const res = await getAuthorities(headers)
    res && handleAuthorityList(res)
  }

  const fetchUserAuthorityList = async () => {
    const res = await getUserAuthorities(headers)
    res && setUserAuthorityList(res)
  }

  const fetchUserData = async () => {
    const res = await getUsers(headers)
    res && setUserList(res)
  }

  const fetchWarehouses = async (companyCode) => {
    const res = await getWarehouses(headers, `companyCode.equals=${companyCode}`)
    res && setWarehouseList(res)
  }

  useEffect(() => {
    if (token.length > 0) {
      fetchCompanyData()
      fetchCompanyCode()
      fetchAuthorityList()
      fetchUserData()
      fetchUserAuthorityList()
    }
  }, [token])

  let path = location.pathname

  let depoCodeUrl = path.split('/').filter((todo) => todo.includes('d:'))

  const fetchDepoData = async (companyCode) => {
    if (cache.get('depoList')) {
      setDepoList(cache.get('depoList'))
    } else {
      try {
        const res = await getWarehouses(headers, `companyCode.equals=${companyCode}`)
        res && setDepoList(res)
        cache.set('depoList', res)
      } catch (e) {}
    }
  }

  const fetchAllDepoData = async (companyCode) => {
    if (cache.get('depoListWithTypes')) {
      setAllDepoList(cache.get('depoListWithTypes'))
    } else {
      try {
        const res = await getWarehouses(headers, `companyCode.equals=${companyCode}`)
        res && handleDepoAllList(res)
        cache.set('depoListWithTypes', res)
      } catch (e) {}
    }
  }

  useEffect(() => {
    if (token.length > 0 && companyCode !== 0) {
      fetchDepoData(companyCode)
      fetchAllDepoData(companyCode)
    }
  }, [token, companyCode])

  useEffect(() => {
    if (depoCodeUrl.length > 0 && depoCode === 1 && depoList.length > 0) {
      let depoKodu = depoCodeUrl[0].slice(2)
      let filteredList = depoList.filter((todo) => todo.code == parseInt(depoKodu))
      setDepoName(filteredList[0]?.name)
    }
  }, [token, depoCodeUrl, depoList])

  return {
    depoCode,
    handleDepoCode,
    depoName,
    handleDepoName,
    depoCombo,
    handleDepoCombo,
    companyInfo,
    handleCompanyInfo,
    depoList,
    isPressedLeftDrawer,
    isDepoMenuOpen,
    handleIsPressedLeftDrawer,
    handleDepoMenu,
    companyCode,
    authorityList,
    allDepoList,
    handleDepoAllList,
    userList,
    userAuthorityList,
    warehouseList,
  }
}

export const DepoContainer = createContainer(useStore)
