import './App.css'
import { Routes, Route } from 'react-router'
import { DepoContainer } from './store/DepoContainer'
import { AuthContainer } from './store/AuthContainer'
import { OrderJustifyContainer } from './store/OrderJustifyContainer'
import { DataStore } from './store/DataStore'
import { ThemeProvider } from '@mui/material/styles'
import lightMode, { darkMode } from './theme/theme'
import { ThemeContainer } from './store/ThemeContainer'
import { HelmetProvider } from 'react-helmet-async'
import 'yet-another-react-lightbox/styles.css'
import { ToastContainer } from 'react-toastify'
import Layout from './layout/Layout'
import ChangePasswordView from './view/Profile/ChangePasswordView'
import LoginView from './view/Auth/LoginView'
import ForgetPasswordView from './view/Auth/ForgetPasswordView'
import { CssBaseline } from '@mui/material'
import ResetPasswordView from './view/Auth/ResetPasswordView'
import BarcodeGeneratorContainer from './container/Barcode/BarcodeGeneratorContainer'

function App() {
  const { colorMode } = ThemeContainer.useContainer()

  return (
    <ThemeProvider theme={colorMode === 'light' ? lightMode : darkMode}>
      <HelmetProvider>
        <AuthContainer.Provider>
          <DepoContainer.Provider>
            <OrderJustifyContainer.Provider>
              <DataStore.Provider>
                <CssBaseline />
                <Routes>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/change-password" element={<ChangePasswordView />} />
                  <Route path="/forget-password" element={<ForgetPasswordView />} />
                  <Route path="/reset-password" element={<ResetPasswordView />} />
                  <Route path="/:depoCode/barcode-generate" element={<BarcodeGeneratorContainer />} />
                  <Route path="*" element={<Layout />} />
                </Routes>
                <ToastContainer autoClose={1500} />
              </DataStore.Provider>
            </OrderJustifyContainer.Provider>
          </DepoContainer.Provider>
        </AuthContainer.Provider>
      </HelmetProvider>
    </ThemeProvider>
  )
}

export default App
