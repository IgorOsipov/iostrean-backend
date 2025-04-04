import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { UserAgent } from '@/src/shared/decorators/user-agent.decorator';
import { CqlContext } from '@/src/shared/types/gql-context.types';

import { LoginInput } from './inputs/login.input';
import { LoginModel } from './models/login.model';
import { SessionModel } from './models/session.model';
import { SessionService } from './session.service';

@Resolver('Session')
export class SessionResolver {
  public constructor(private readonly sessionService: SessionService) {}

  @Authorization()
  @Query(() => [SessionModel], { name: 'findSessionsByUser' })
  public async findByUser(@Context() { req }: CqlContext) {
    return this.sessionService.findByUser(req);
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'findCurrentSession' })
  public async findCurrent(@Context() { req }: CqlContext) {
    return this.sessionService.findCurrent(req);
  }

  @Mutation(() => LoginModel, { name: 'login' })
  public async login(
    @Context() { req }: CqlContext,
    @Args('input') input: LoginInput,
    @UserAgent() userAgent: string
  ) {
    return this.sessionService.login(req, input, userAgent);
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req }: CqlContext) {
    return this.sessionService.logout(req);
  }

  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public async clearSession(@Context() { req }: CqlContext) {
    return this.sessionService.clearSessions(req);
  }
  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(@Context() { req }: CqlContext, @Args('id') id: string) {
    return this.sessionService.remove(req, id);
  }
}
