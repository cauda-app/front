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
  DateTime: any;
  Time: any;
  Date: any;
};

export type Client = {
   __typename?: 'Client';
  id: Scalars['ID'];
  phone: Scalars['String'];
  isPhoneValidated: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
};

export type ClientSingupInput = {
  phone: Scalars['String'];
};



export type Mutation = {
   __typename?: 'Mutation';
  registerShop: Shop;
  singUp: Client;
  updateShop: Shop;
  verifyClient: Client;
};


export type MutationRegisterShopArgs = {
  shop: ShopInput;
};


export type MutationSingUpArgs = {
  client: ClientSingupInput;
};


export type MutationUpdateShopArgs = {
  shop: ShopInput;
};


export type MutationVerifyClientArgs = {
  id: Scalars['ID'];
  verificationCode: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  client?: Maybe<Client>;
  nearShops: Array<Shop>;
  shop?: Maybe<Shop>;
  shops: Array<Shop>;
};


export type QueryClientArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryNearShopsArgs = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};


export type QueryShopArgs = {
  id: Scalars['ID'];
};

export type Shop = {
   __typename?: 'Shop';
  id: Scalars['ID'];
  isClosed: Scalars['Boolean'];
  lastNumber: Scalars['Int'];
  nextNumber: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  details: ShopDetails;
};

export type ShopDetails = {
   __typename?: 'ShopDetails';
  address: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  ownerPhone: Scalars['String'];
  isOwnerPhoneValidated: Scalars['Boolean'];
  mondayTimeEnd?: Maybe<Scalars['String']>;
  mondayTimeStart?: Maybe<Scalars['String']>;
  tuesdayTimeEnd?: Maybe<Scalars['String']>;
  tuesdayTimeStart?: Maybe<Scalars['String']>;
  wednesdayTimeEnd?: Maybe<Scalars['String']>;
  wednesdayTimeStart?: Maybe<Scalars['String']>;
  thursdayTimeEnd?: Maybe<Scalars['String']>;
  thursdayTimeStart?: Maybe<Scalars['String']>;
  fridayTimeEnd?: Maybe<Scalars['String']>;
  fridayTimeStart?: Maybe<Scalars['String']>;
  saturdayTimeEnd?: Maybe<Scalars['String']>;
  saturdayTimeStart?: Maybe<Scalars['String']>;
  sundayTimeEnd?: Maybe<Scalars['String']>;
  sundayTimeStart?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
};

export type ShopInput = {
  id?: Maybe<Scalars['ID']>;
  address: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  ownerPhone: Scalars['String'];
  isClosed?: Maybe<Scalars['Boolean']>;
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
  Query: ResolverTypeWrapper<{}>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Client: ResolverTypeWrapper<Client>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Shop: ResolverTypeWrapper<Shop>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  ShopDetails: ResolverTypeWrapper<ShopDetails>,
  Mutation: ResolverTypeWrapper<{}>,
  ShopInput: ShopInput,
  Time: ResolverTypeWrapper<Scalars['Time']>,
  ClientSingupInput: ClientSingupInput,
  Date: ResolverTypeWrapper<Scalars['Date']>,
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {},
  ID: Scalars['ID'],
  Client: Client,
  String: Scalars['String'],
  Boolean: Scalars['Boolean'],
  DateTime: Scalars['DateTime'],
  Float: Scalars['Float'],
  Shop: Shop,
  Int: Scalars['Int'],
  ShopDetails: ShopDetails,
  Mutation: {},
  ShopInput: ShopInput,
  Time: Scalars['Time'],
  ClientSingupInput: ClientSingupInput,
  Date: Scalars['Date'],
}>;

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isPhoneValidated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  registerShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationRegisterShopArgs, 'shop'>>,
  singUp?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationSingUpArgs, 'client'>>,
  updateShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationUpdateShopArgs, 'shop'>>,
  verifyClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationVerifyClientArgs, 'id' | 'verificationCode'>>,
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientArgs, never>>,
  nearShops?: Resolver<Array<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<QueryNearShopsArgs, 'lat' | 'lng'>>,
  shop?: Resolver<Maybe<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<QueryShopArgs, 'id'>>,
  shops?: Resolver<Array<ResolversTypes['Shop']>, ParentType, ContextType>,
}>;

export type ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shop'] = ResolversParentTypes['Shop']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isClosed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  nextNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  details?: Resolver<ResolversTypes['ShopDetails'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ShopDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopDetails'] = ResolversParentTypes['ShopDetails']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ownerPhone?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  isOwnerPhoneValidated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  mondayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  mondayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tuesdayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  tuesdayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  wednesdayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  wednesdayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  thursdayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  thursdayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fridayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  fridayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  saturdayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  saturdayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  sundayTimeEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  sundayTimeStart?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time'
}

export type Resolvers<ContextType = any> = ResolversObject<{
  Client?: ClientResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Shop?: ShopResolvers<ContextType>,
  ShopDetails?: ShopDetailsResolvers<ContextType>,
  Time?: GraphQLScalarType,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
