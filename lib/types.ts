export type Role = 'admin' | 'member'
export type MemberStatus = 'pending' | 'approved' | 'disabled'
export type PropertyStatus = 'pending' | 'approved' | 'sold' | 'rejected'
export type PropertyType = 'residential' | 'commercial' | 'land'

export interface Profile {
  id: string
  full_name: string
  phone: string
  whatsapp?: string
  area?: string
  role: Role
  status: MemberStatus
  avatar_url?: string
  created_at: string
}

export interface Property {
  id: string
  member_id: string
  title: string
  property_type: PropertyType
  description?: string
  location: string
  area_sqft?: number
  price?: number
  price_negotiable: boolean
  facing?: string
  status: PropertyStatus
  cover_image_url?: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  display_order: number
  created_at: string
}