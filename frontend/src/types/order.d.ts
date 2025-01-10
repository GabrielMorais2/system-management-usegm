export interface OrderItem {
    name: string
    quantity: number
    image: string
    color: string
}

export interface CustomerDetails {
    name: string
    email: string
    phone: string
}

export interface ShippingDetails {
    type: string
    deliveryAddress: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    deliveryDate: string
    excursionName: string | null
    seatNumber: string | null
    sector: string | null
    transporterName: string | null
}

export interface Order {
    id: number
    customerDetails: CustomerDetails
    shippingDetails: ShippingDetails
    value: number
    status: 'ABERTO' | 'LOJA' | 'COMPLETO'
    createdAt: Date | null
    observations?: string
    items: OrderItem[]
}
