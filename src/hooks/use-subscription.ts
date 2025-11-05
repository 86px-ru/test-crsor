'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Subscription {
  plan_type: 'monthly' | 'yearly' | 'lifetime'
  status: 'active' | 'expired' | 'cancelled'
  expires_at: string | null
  days_remaining: number | null
}

export function useSubscription(telegramId: number | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (!telegramId) {
      setLoading(false)
      return
    }

    checkSubscription()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegramId])

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type, status, expires_at')
        .eq('telegram_id', telegramId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Subscription check error:', error)
        setHasAccess(false)
        setSubscription(null)
        setLoading(false)
        return
      }

      if (data && data.length > 0) {
        const subscriptionData = data[0]
        
        // Проверяем срок действия подписки
        if (subscriptionData.expires_at) {
          const expiresAt = new Date(subscriptionData.expires_at)
          if (expiresAt < new Date()) {
            // Подписка истекла
            setHasAccess(false)
            setSubscription(null)
            setLoading(false)
            return
          }
        }
        
        const expiresAt = subscriptionData.expires_at ? new Date(subscriptionData.expires_at) : null
        const daysRemaining = expiresAt 
          ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          : null

        setSubscription({
          plan_type: subscriptionData.plan_type,
          status: subscriptionData.status,
          expires_at: subscriptionData.expires_at,
          days_remaining: daysRemaining
        })
        setHasAccess(true)
      } else {
        setHasAccess(false)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Subscription check failed:', error)
      setHasAccess(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    subscription,
    hasAccess,
    loading,
    refresh: checkSubscription
  }
}

