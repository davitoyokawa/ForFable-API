/* eslint-disable prettier/prettier */

import { CommentReaction, ReactionType, WriteReaction } from "App/Models/Reaction"

export function cleanReactions(reactions: CommentReaction[]|WriteReaction[]): any[] {
  let cleanReactions = reactions.map((value: CommentReaction|WriteReaction) => {
    return { type: value.type, amount: value.id }
  })

  let positiveConclusive = cleanReactions.find((value)=>value.type === ReactionType.POSITIVE_CONCLUSIVE)?.amount || 0

  cleanReactions = cleanReactions.filter((value)=> value.type !== ReactionType.POSITIVE_CONCLUSIVE)

  const positive = cleanReactions.find((value)=>value.type === ReactionType.POSITIVE)
  if (positive) {
    positive.amount+=positiveConclusive
  } else {
    cleanReactions.push({type: ReactionType.POSITIVE, amount: positiveConclusive})
  }

  const conclusive = cleanReactions.find((value)=>value.type === ReactionType.CONCLUSIVE)
  if (conclusive) {
    conclusive.amount+=positiveConclusive
  } else {
    cleanReactions.push({type: ReactionType.CONCLUSIVE, amount: positiveConclusive})
  }

  cleanReactions = cleanReactions.filter((value)=> value.amount > 0)

  return cleanReactions
}

