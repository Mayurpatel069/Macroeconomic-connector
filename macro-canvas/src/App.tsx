import AppLayout from './components/Layout/AppLayout'
import ApiKeyModal from './components/Settings/ApiKeyModal'
import { useAppStore } from './store/appStore'

export default function App() {
  const showApiKeyModal = useAppStore((s) => s.showApiKeyModal)

  return (
    <>
      <AppLayout />
      {showApiKeyModal && <ApiKeyModal />}
    </>
  )
}
