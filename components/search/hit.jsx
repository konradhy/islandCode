import { Highlight } from "react-instantsearch";
import { getPropertyByPath } from 'instantsearch.js/es/lib/utils';

export const Hit = ({ hit }) => {
  return (
    <article>
      <div className="hit-caseTitle">
			  <Highlight attribute="caseTitle" hit={hit} />
			</div>
			<div className="hit-caseNumber">
			  <Highlight attribute="caseNumber" hit={hit} />
			</div>
			<div className="hit-jurisdiction">
			  <Highlight attribute="jurisdiction" hit={hit} />
			</div>
    </article>
  );
};