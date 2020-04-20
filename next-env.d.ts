/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next-images" />

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;

  export = Schema;
}
