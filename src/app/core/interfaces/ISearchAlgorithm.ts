import { Node } from '../models/Node';
import { SearchResult } from '../models/SearchResult';

export interface ISearchAlgorithm {
  Find(from: Node, to: Node): SearchResult;
  Name: string;
}
