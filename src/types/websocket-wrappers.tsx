export interface MessagePayload {
  id?: string;             
  body: string;
  sender_id?: string;
  receiver_id: string;
  timestamp?: string;
}

export interface Envelope<T = any> {
  type: string
  data: T
}