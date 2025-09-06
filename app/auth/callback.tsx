import { useEffect } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/router'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/auth/assign-role')
      }
    }
    getSession()
  }, [router])

  return <p>Loading...</p>
}
