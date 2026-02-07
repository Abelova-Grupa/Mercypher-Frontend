export interface MessagePayload {
  sender_id?: string
  receiver_id: string
  body: string
}

export interface Envelope<T = any> {
  type: string
  data: T
}