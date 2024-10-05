import { liteClient as algoliasearch } from "algoliasearch/lite";
import "instantsearch.css/themes/satellite.css";
import { Hits, InstantSearch, SearchBox, Configure } from "react-instantsearch";

import { Hit } from "./hit";

const searchClient = algoliasearch("RZCVL2GI19", "42ec3296cd9a073ac69972a228305b75");

export const Search = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="islandcode"
    >
      <Configure hitsPerPage={5} />
      <div className="ais-InstantSearch">
        <SearchBox />
        <Hits hitComponent={Hit} />
      </div>
    </InstantSearch>
  );
};