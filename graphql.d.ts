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
  getAppointments: Array<IssuedNumber>;
  nearShops: Array<Shop>;
  shop?: Maybe<Shop>;
  shops: Array<Shop>;
};


export type QueryClientArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryGetAppointmentsArgs = {
  clientId: Scalars['Int'];
  shopId?: Maybe<Scalars['String']>;
};


export type QueryNearShopsArgs = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};


export type QueryShopArgs = {
  id: Scalars['String'];
};

export type Mutation = {
   __typename?: 'Mutation';
  cancelAppointment: Scalars['Boolean'];
  reSendVerificationCode: Scalars['Boolean'];
  registerShop: Shop;
  requestAppointment: IssuedNumber;
  signUp: Client;
  updateShop: Shop;
  verifyCode: Scalars['Boolean'];
};


export type MutationCancelAppointmentArgs = {
  shopId: Scalars['String'];
  clientId: Scalars['Int'];
};


export type MutationReSendVerificationCodeArgs = {
  phone: Scalars['ID'];
};


export type MutationRegisterShopArgs = {
  shop: ShopInput;
};


export type MutationRequestAppointmentArgs = {
  shopId: Scalars['String'];
  clientId: Scalars['Int'];
};


export type MutationSignUpArgs = {
  client: ClientSignupInput;
};


export type MutationUpdateShopArgs = {
  shop: ShopInput;
};


export type MutationVerifyCodeArgs = {
  phone: Scalars['String'];
  code: Scalars['Int'];
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

export type Shop = {
   __typename?: 'Shop';
  id: Scalars['ID'];
  isClosed: Scalars['Boolean'];
  lastNumber: Scalars['Int'];
  nextNumber: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  details: ShopDetails;
  issuedNumber: Array<IssuedNumber>;
};

export type ShopDetails = {
   __typename?: 'ShopDetails';
  address: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  name: Scalars['String'];
  ownerPhone: Scalars['String'];
  shopPhone?: Maybe<Scalars['String']>;
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
  updatedAt: Scalars['DateTime'];
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
  String: ResolverTypeWrapper<Scalars['String']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  Client: ResolverTypeWrapper<Client>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Query: ResolverTypeWrapper<{}>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Mutation: ResolverTypeWrapper<{}>,
  ClientSignupInput: ClientSignupInput,
  Date: ResolverTypeWrapper<Scalars['Date']>,
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>,
  Time: ResolverTypeWrapper<Scalars['Time']>,
  IssuedNumberStatus: IssuedNumberStatus,
  IssuedNumber: ResolverTypeWrapper<IssuedNumber>,
  Shop: ResolverTypeWrapper<Shop>,
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
  Int: Scalars['Int'],
  Float: Scalars['Float'],
  Mutation: {},
  ClientSignupInput: ClientSignupInput,
  Date: Scalars['Date'],
  DateTime: Scalars['DateTime'],
  Time: Scalars['Time'],
  IssuedNumberStatus: IssuedNumberStatus,
  IssuedNumber: IssuedNumber,
  Shop: Shop,
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
  getAppointments?: Resolver<Array<ResolversTypes['IssuedNumber']>, ParentType, ContextType, RequireFields<QueryGetAppointmentsArgs, 'clientId'>>,
  nearShops?: Resolver<Array<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<QueryNearShopsArgs, 'lat' | 'lng'>>,
  shop?: Resolver<Maybe<ResolversTypes['Shop']>, ParentType, ContextType, RequireFields<QueryShopArgs, 'id'>>,
  shops?: Resolver<Array<ResolversTypes['Shop']>, ParentType, ContextType>,
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  cancelAppointment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationCancelAppointmentArgs, 'shopId' | 'clientId'>>,
  reSendVerificationCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationReSendVerificationCodeArgs, 'phone'>>,
  registerShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationRegisterShopArgs, 'shop'>>,
  requestAppointment?: Resolver<ResolversTypes['IssuedNumber'], ParentType, ContextType, RequireFields<MutationRequestAppointmentArgs, 'shopId' | 'clientId'>>,
  signUp?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'client'>>,
  updateShop?: Resolver<ResolversTypes['Shop'], ParentType, ContextType, RequireFields<MutationUpdateShopArgs, 'shop'>>,
  verifyCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationVerifyCodeArgs, 'phone' | 'code'>>,
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

export type ShopResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shop'] = ResolversParentTypes['Shop']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  isClosed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  lastNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  nextNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  details?: Resolver<ResolversTypes['ShopDetails'], ParentType, ContextType>,
  issuedNumber?: Resolver<Array<ResolversTypes['IssuedNumber']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type ShopDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShopDetails'] = ResolversParentTypes['ShopDetails']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ownerPhone?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  shopPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
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
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Client?: ClientResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  Time?: GraphQLScalarType,
  IssuedNumber?: IssuedNumberResolvers<ContextType>,
  Shop?: ShopResolvers<ContextType>,
  ShopDetails?: ShopDetailsResolvers<ContextType>,
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
