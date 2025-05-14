import { Products } from "../product/product"

export interface Wishlist {
  _id: string
  user: string
  items: Item[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Item {
  products: Products
  quantity: number
  _id: string
  addedAt: string
}

