export interface MessagePayload {
  receiver_id: string
  body: string
}

export interface Envelope<T = any> {
  type: string
  data: T
}