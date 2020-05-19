import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Time: any;
};

export type Client = {
   __typename?: 'Client';
  id: Scalars['ID'];
  phone: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Query = {
   __typename?: 'Query';
  client?: Maybe<Client>;
  lastTurns: Array<LastTurns>;
  myPastTurns: Array<TurnResponse>;
  myShop: Shop;
  myTurn: Client;
  myTurns: Array<TurnResponse>;
  nearByShops: Array<ShopDetails>;
  shops: Array<Shop>;
  turn: TurnResponse;
};


export type QueryClientArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryLastTurnsArgs = {
  shopId: Scalars['ID'];
};


export type QueryNearByShopsArgs = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  offset?: Scalars['Int'];
};


export type QueryTurnArgs = {
  turnId: Scalars['ID'];
};

export type ClientSignupInput = {
  phone: Scalars['String'];
};




export enum IssuedNumberStatus {
  Pending = 'PENDING',
  Attended = 'ATTENDED',
  Skipped = 'SKIPPED',
  Cancelled = 'CANCELLED'
}

export type IssuedNumber = {
   __typename?: 'IssuedNumber';
  id: Scalars['ID'];
  issuedNumber?: Maybe<Scalars['Int']>;
  status: IssuedNumberStatus;
  clientId: Scalars['Int'];
  shopId: Scalars['String'];
  client: Client;
  shop: Shop;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type TurnResponse = {
   __typename?: 'TurnResponse';
  id: Scalars['ID'];
  turn: Scalars['String'];
  shopId: Scalars['String'];
  shopName: Scalars['String'];
  status: IssuedNumberStatus;
};

export type RequestTurnResponse = {
   __typename?: 'RequestTurnResponse';
  id: Scalars['ID'];
  pendingTurnsAmount: Scalars['Int'];
};

export type Mutation = {
   __typename?: 'Mutation';
  cancelTurn: Scalars['Boolean'];
  cancelTurns: Shop;
  nextTurn: Shop;
  registerShop: Shop;
  requestTurn: RequestTurnResponse;
  updateShop: Shop;
  verifyCode: Scalars['Boolean'];
  verifyPhone: Scalars['DateTime'];
};


export type MutationCancelTurnArgs = {
  turnId: Scalars['ID'];
};


export type MutationNextTurnArgs = {
  op: NextTurnOperation;
};


export type MutationRegisterShopArgs = {
  shop: ShopInput;
};


export type MutationRequestTurnArgs = {
  shopId: Scalars['ID'];
};


export type MutationUpdateShopArgs = {
  shop: ShopInput;
};


export type MutationVerifyCodeArgs = {
  phone: Scalars['String'];
  code: Scalars['Int'];
};


export type MutationVerifyPhoneArgs = {
  phone: Scalars['String'];
};

export enum NextTurnOperation {
  Attend = 'ATTEND',
  Skip = 'SKIP'
}

export type Shop = {
   __typename?: 'Shop';
  id: Scalars['ID'];
  isClosed: Scalars['Boolean'];
  lastNumber: Scalars['Int'];
  nextNumber: Scalars['Int'];
  nextTurn?: Maybe<Scalars['String']>;
  lastTurns: Array<LastTurns>;
  pendingTurnsAmount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  details: ShopDetails;
  issuedNumber: Array<IssuedNumber>;
};

export type LastTurns = {
   __typename?: 'LastTurns';
  status: IssuedNumberStatus;
  turn: Scalars['String'];
};

export type ShopStatus = {
   __typename?: 'ShopStatus';
  opens: Scalars['Time'];
  closes: Scalars['Time'];
};

export type ShopDetails = {
   __typename?: 'ShopDetails';
  shopId: Scalars['ID'];
  address: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  ownerPhone: Scalars['String'];
  shopPhone?: Maybe<Scalars['String']>;
  isOpen: Scalars['Boolean'];
  status?: Maybe<ShopStatus>;
  mondayTimeEnd?: Maybe<Scalars['Time']>;
  mondayTimeStart?: Maybe<Scalars['Time']>;
  tuesdayTimeEnd?: Maybe<Scalars['Time']>;
  tuesdayTimeStart?: Maybe<Scalars['Time']>;
  wednesdayTimeEnd?: Maybe<Scalars['Time']>;
  wednesdayTimeStart?: Maybe<Scalars['Time']>;
  thursdayTimeEnd?: Maybe<Scalars['Time']>;
  thursdayTimeStart?: Maybe<Scalars['Time']>;
  fridayTimeEnd?: Maybe<Scalars['Time']>;
  fridayTimeStart?: Maybe<Scalars['Time']>;
  saturdayTimeEnd?: Maybe<Scalars['Time']>;
  saturdayTimeStart?: Maybe<Scalars['Time']>;
  sundayTimeEnd?: Maybe<Scalars['Time']>;
  sundayTimeStart?: Maybe<Scalars['Time']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ShopInput = {
  id?: Maybe<Scalars['ID']>;
  address: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  shopPhone?: Maybe<Scalars['String']>;
  mondayTimeEnd?: Maybe<Scalars['Time']>;
  mondayTimeStart?: Maybe<Scalars['Time']>;
  tuesdayTimeEnd?: Maybe<Scalars['Time']>;
  tuesdayTimeStart?: Maybe<Scalars['Time']>;
  wednesdayTimeEnd?: Maybe<Scalars['Time']>;
  wednesdayTimeStart?: Maybe<Scalars['Time']>;
  thursdayTimeEnd?: Maybe<Scalars['Time']>;
  thursdayTimeStart?: Maybe<Scalars['Time']>;
  fridayTimeEnd?: Maybe<Scalars['Time']>;
  fridayTimeStart?: Maybe<Scalars['Time']>;
  saturdayTimeEnd?: Maybe<Scalars['Time']>;
  saturdayTimeStart?: Maybe<Scalars['Time']>;
  sundayTimeEnd?: Maybe<Scalars['Time']>;
  sundayTimeStart?: Maybe<Scalars['Time']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Client: ResolverTypeWrapper<Client>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Query: ResolverTypeWrapper<{}>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ClientSignupInput: ClientSignupInput,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Time: ResolverTypeWrapper<Scalars['Time']>,
  IssuedNumberStatus: IssuedNumberStatus,
  IssuedNumber: ResolverTypeWrapper<IssuedNumber>,
  TurnResponse: ResolverTypeWrapper<TurnResponse>,
  RequestTurnResponse: ResolverTypeWrapper<RequestTurnResponse>,
  Mutation: ResolverTypeWrapper<{}>,
  NextTurnOperation: NextTurnOperation,
  Shop: ResolverTypeWrapper<Shop>,
  LastTurns: ResolverTypeWrapper<LastTurns>,
  ShopStatus: ResolverTypeWrapper<ShopStatus>,
  ShopDetails: ResolverTypeWrapper<ShopDetails>,
  ShopInput: ShopInput,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  Client: Client,
  ID: Scalars['ID'],
  Query: {},
  Float: Scalars['Float'],
  Int: Scalars['Int'],
  ClientSignupInput: ClientSignupInput,
  Date: Scalars['Date'],
  DateTime: Scalars['DateTime'],
  Time: Scalars['Time'],
  IssuedNumberStatus: IssuedNumberStatus,
  IssuedNumber: IssuedNumber,
  TurnResponse: TurnResponse,
  RequestTurnResponse: RequestTurnResponse,
  Mutation: {},
  NextTurnOperation: NextTurnOperation,
  Shop: Shop,
  LastTurns: LastTurns,
  ShopStatus: ShopStatus,
  ShopDetails: ShopDetails,
  ShopInput: ShopInput,
}>;

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientArgs, never>>,
  lastTurns?: Resolver<Array<ResolversTypes['LastTurns']>, ParentType, ContextType, RequireFields<QueryLastTurnsArgs, 'shopId'>>,
  myPastTurns?: Resolver<Array<ResolversTypes['TurnResponse']>, ParentType, ContextType>,
  myShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType>,
  myTurn?: Resolver<ResolversTypes['Client'], ParentType, ContextType>,
  myTurns?: Resolver<Array<ResolversTypes['TurnResponse']>, ParentType, ContextType>,
  nearByShops?: Resolver<Array<ResolversTypes['ShopDetails']>, ParentType, ContextType, RequireFields<QueryNearByShopsArgs, 'lat' | 'lng' | 'offset'>>,
  shops?: Resolver<Array<ResolversTypes['Shop']>, ParentType, ContextType>,
  turn?: Resolver<ResolversTypes['TurnResponse'], ParentType, ContextType, RequireFields<QueryTurnArgs, 'turnId'>>,
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time'
}

export type IssuedNumberResolvers<ContextType = any, ParentType extends ResolversParentTypes['IssuedNumber'] = ResolversParentTypes['IssuedNumber']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  issuedNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  status?: Resolver<ResolversTypes['IssuedNumberStatus'], ParentType, ContextType>,
  clientId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  shopId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>,
  shop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type TurnResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TurnResponse'] = ResolversParentTypes['TurnResponse']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  turn?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shopId?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shopName?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['IssuedNumberStatus'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type RequestTurnResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestTurnResponse'] = ResolversParentTypes['RequestTurnResponse']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  pendingTurnsAmount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  cancelTurn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCancelTurnArgs, 'turnId'>>,
  cancelTurns?: Resolver<ResolversTypes['Shop'], ParentType, ContextType>,
  nextTurn?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationNextTurnArgs, 'op'>>,
  registerShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationRegisterShopArgs, 'shop'>>,
  requestTurn?: Resolver<ResolversTypes['RequestTurnResponse'], ParentType, ContextType, RequireFields<MutationRequestTurnArgs, 'shopId'>>,
  updateShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationUpdateShopArgs, 'shop'>>,
  verifyCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationVerifyCodeArgs, 'phone' | 'code'>>,
  verifyPhone?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType, RequireFields<MutationVerifyPhoneArgs, 'phone'>>,
}>;

export type ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shop'] = ResolversParentTypes['Shop']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isClosed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  nextNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  nextTurn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lastTurns?: Resolver<Array<ResolversTypes['LastTurns']>, ParentType, ContextType>,
  pendingTurnsAmount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  details?: Resolver<ResolversTypes['ShopDetails'], ParentType, ContextType>,
  issuedNumber?: Resolver<Array<ResolversTypes['IssuedNumber']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type LastTurnsResolvers<ContextType = any, ParentType extends ResolversParentTypes['LastTurns'] = ResolversParentTypes['LastTurns']> = ResolversObject<{
  status?: Resolver<ResolversTypes['IssuedNumberStatus'], ParentType, ContextType>,
  turn?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ShopStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopStatus'] = ResolversParentTypes['ShopStatus']> = ResolversObject<{
  opens?: Resolver<ResolversTypes['Time'], ParentType, ContextType>,
  closes?: Resolver<ResolversTypes['Time'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ShopDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopDetails'] = ResolversParentTypes['ShopDetails']> = ResolversObject<{
  shopId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ownerPhone?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shopPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  isOpen?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  status?: Resolver<Maybe<ResolversTypes['ShopStatus']>, ParentType, ContextType>,
  mondayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  mondayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  tuesdayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  tuesdayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  wednesdayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  wednesdayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  thursdayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  thursdayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  fridayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  fridayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  saturdayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  saturdayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  sundayTimeEnd?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  sundayTimeStart?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Client?: ClientResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  Time?: GraphQLScalarType,
  IssuedNumber?: IssuedNumberResolvers<ContextType>,
  TurnResponse?: TurnResponseResolvers<ContextType>,
  RequestTurnResponse?: RequestTurnResponseResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Shop?: ShopResolvers<ContextType>,
  LastTurns?: LastTurnsResolvers<ContextType>,
  ShopStatus?: ShopStatusResolvers<ContextType>,
  ShopDetails?: ShopDetailsResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
