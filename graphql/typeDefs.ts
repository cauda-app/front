import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

export default mergeTypes(fileLoader('./graphql/**/*.graphql'), { all: true });
