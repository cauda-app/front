import { fileLoader, mergeTypes } from 'merge-graphql-schemas'
import path from 'path';

export default mergeTypes(fileLoader(path.join(__dirname, "./**/*.graphql")), {all: true})
