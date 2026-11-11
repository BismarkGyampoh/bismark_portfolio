import { createContext, useContext, useEffect, useState } from 'react'
import { profile as defaultProfile } from '../data/profile.js'
import { getProfileContent } from '../services/portfolio.js'

const ProfileContext = createContext(defaultProfile)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile)

  useEffect(() => {
    let active = true
    getProfileContent().then((result) => {
      if (active && result) {
        const initials = result.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
        setProfile({ ...defaultProfile, ...result, initials, cvAvailable: Boolean(result.cvPath) })
      }
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const title = `${profile.name} | ${profile.title}`
    const description = profile.introduction || profile.headline
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  }, [profile.name, profile.title, profile.headline, profile.introduction])

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  return useContext(ProfileContext)
}
