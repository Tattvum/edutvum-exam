import { User, EMPTY_USER } from "./user";

export class Comment {
  constructor(
    readonly title: string,
    readonly when: Date,
    readonly user: User
  ){}
}

export type CommentList = Comment[]

export const EMPTY_COMMENT = new Comment("Dummy Comment", new Date(), EMPTY_USER)
