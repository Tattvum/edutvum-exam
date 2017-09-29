export enum UserRole {
  USER, ADMIN
}

export interface User {
  readonly uid: string
  readonly name: string
  readonly email: string
  readonly role: UserRole
}

export const EMPTY_USER = {
  uid: 'u1',
  name: 'Bingo User',
  email: 'bingo@gmail.com',
  role: UserRole.USER
}
