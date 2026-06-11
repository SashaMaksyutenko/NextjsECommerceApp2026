import { z } from 'zod'
export type ProductType = {
  id: string | number
  name: string
  shortDescription: string
  description: string
  price: number
  sizes: string[]
  colors: string[]
  images: Record<string, string>
  stock?: number
  category?: string
  isActive?: boolean
}
export type ProductsType = ProductType[]

export type CartItemType = ProductType & {
  quantity: number
  selectedSize: string
  selectedColor: string
}

export type CartItemsType = CartItemType[]

export const shippingFormSchema = z.object({
  name: z.string().min(1, 'Name is required!'),
  email: z.string().email('Invalid email address!'),
  phone: z
    .string()
    .min(7, 'Phone number must be between 7 and 10 digits!')
    .max(10, 'Phone number must be between 7 and 10 digits!')
    .regex(/^\d+$/, 'Phone number must contain only numbers!'),
  address: z.string().min(1, 'Address is required!'),
  city: z.string().min(1, 'City is required!'),
  zip: z.string().min(1, 'ZIP code is required!'),
  country: z.string().min(1, 'Country is required!'),
})
export type ShippingFormInputs = z.infer<typeof shippingFormSchema>
export type CartStoreStateType = {
  cart: CartItemsType,
  hasHydrated: boolean
}
export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void
  removeFromCart: (product: CartItemType) => void
  clearCart: () => void
}
