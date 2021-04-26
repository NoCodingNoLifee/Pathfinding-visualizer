import { Node } from './Node';

export interface SearchResult {
  Succeed: boolean;
  Path: Array<Node>;
  VisitedNodes: Array<Node>;
}
