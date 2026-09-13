import Seo from '../../shared/components/Seo'
import CountingDefinitionContainer from '../../container/Counting-Backoffice/CountingDefinitionContainer'
import CountingProvider from '../../context/CountingContext'

export default function CountingDefinitionView() {
  return (
    <>
      <Seo title="Sayım Tanımlama" />
      <CountingProvider>
        <CountingDefinitionContainer />
      </CountingProvider>
    </>
  )
}
