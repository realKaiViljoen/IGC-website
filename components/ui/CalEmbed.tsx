'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

export function CalEmbed() {
  useEffect(() => {
    ;(async function () {
      const cal = await getCalApi({ namespace: 'moreclients' })
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'column_view',
      })
    })()
  }, [])

  return (
    <Cal
      namespace="moreclients"
      calLink="igc-consulting/moreclients"
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
      config={{
        layout: 'column_view',
        useSlotsViewOnSmallScreen: 'true',
        theme: 'dark',
      }}
    />
  )
}
