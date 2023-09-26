import { ProposalEntity, ProposalInsert, ProposalRepository, ReactionType } from "@ioc:forfabledomain"
import Proposal from "App/Models/Proposal"
import Write from "App/Models/Write"

export class ProposalPersistence implements ProposalRepository {
  public static instance = new ProposalPersistence()

  async getProposalsByPrompt(promptId: number): Promise<ProposalEntity[]> {
    return await Proposal.query().where('promptId', '=', promptId)
  }

  async getIndexedProposalsByPrompt(promptId: number, index: number): Promise<ProposalEntity[]> {
    return await Proposal.query()
      .where('promptId', '=', promptId)
      .where('orderInHistory', '=', index)
  }

  async find(entityId: number): Promise<ProposalEntity | null> {
    return Proposal.find(entityId)
  }

  async fullFind(proposalId: number): Promise<ProposalEntity|null> {
    const proposal = await Proposal.find(proposalId)
    if(!proposal) {
      return null
    }
    await proposal.load('prompt')
    await proposal.write.load('author')
    delete proposal.write.$attributes.authorId
    return proposal
  }

  async findAll(): Promise<ProposalEntity[]> {
    return Proposal.all()
  }

  async create(body: Omit<ProposalInsert, 'text'>): Promise<ProposalEntity> {
    const proposal = await Proposal.create(body)
    await proposal.load('write')
    await proposal.write.load('author')
    await proposal.load('prompt')
    return proposal
  }

  async delete(entityId: number): Promise<ProposalEntity | null> {
    const proposal = await Proposal.find(entityId)
    if (proposal) {
      await proposal.delete()
      return proposal
    } else {
      return null
    }
  }

  async update(entityId: number, { text, definitive }: Partial<ProposalInsert> & { definitive?: boolean }): Promise<ProposalEntity | null> {
    const proposal = await Proposal.find(entityId)
    if (proposal) {
      const proposalWrite = proposal.write
      proposalWrite.merge({text: text, edited: true})
      if (definitive) {
        proposal.merge({ definitive: definitive })
        await proposal.save()
      }
      await proposalWrite.save()
      await proposal.load('write')
      return proposal
    } else {
      return null
    }
  }

  async findByWriteId(writeId: number): Promise<ProposalEntity | null> {
    const proposal = await Proposal.query().where('writeId', '=', writeId)
    if (proposal.length > 0){
      return proposal[0]
    } else {
      return null
    }
  }

  async getAmountOfConclusiveReactions(proposal: Proposal): Promise<number> {
    const response = await Write.query()
      .join('write_reactions', 'writes.id', '=', 'write_reactions.write_id')
      .where('writes.id', '=', proposal.write.id)
      .where('write_reactions.type', '=', ReactionType.CONCLUSIVE)
      .orWhere('write_reactions.type', '=', ReactionType.POSITIVE_CONCLUSIVE)
      .countDistinct('writes.id as id')
      .count('* as total')

    return response[0].$extras.total
  }
}