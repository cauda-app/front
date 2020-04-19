import { Context } from '../context'
import { MutationSingUpArgs, MutationVerifyClientArgs } from '../graphql'

const clientResolver = {
  Query: {
    client: (parent, args, ctx: Context) => {
      return ctx.prisma.client.findOne({
        where: { id: Number(args.id) },
      })
    },
  },
  Mutation: {
    singUp: (parent, args: MutationSingUpArgs, ctx: Context) => {
      return ctx.prisma.client.create({
        data: {
          phone: args.client.phone,
          phoneValidated: undefined,
        },
      })
    },
    verifyClient: (parent, args: MutationVerifyClientArgs, ctx: Context) => {
      return ctx.prisma.client.update({
        where: { id: Number(args.id) },
        data: { phoneValidated: new Date().toISOString() },
      })
    },
  },
}

export default clientResolver
