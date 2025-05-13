export interface Products {
  _id: string
  name: string
  brand: string
  type: string
  gender: string
  ageGroup: string
  price: number
  discountPrice: number
  stock: number
  images: string[]
  description: string
  isFeatured: boolean
  movementType: string
  caseMaterial: string
  bandMaterial: string
  waterResistance: string
  displayType: string
  specifications: Specifications
  keywords: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Specifications {
  "Model Number": string
  Warranty: string
  "Water Resistance": string
  Movement: string
  "Rotating Bezel": string
  Luminosity: string
}
