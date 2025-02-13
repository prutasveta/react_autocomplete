import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList';
import { Person } from './types/Person';

import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [people] = useState(peopleFromServer);
  const [isFocused, setIsFoused] = useState(false);
  const [seletedPerson, setSeletedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.includes(query));
  }, [appliedQuery, people]);

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeletedPerson(null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelect = (person: Person) => {
    setSeletedPerson(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {seletedPerson
            ? `${seletedPerson?.name} (${seletedPerson?.born} - ${seletedPerson?.died})`
            : 'No selected person'}
          {}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onFocus={() => setIsFoused(true)}
              onBlur={() => setIsFoused(false)}
              onChange={handleQueryChange}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {isFocused && (
              <PeopleList
                people={filteredPeople}
                onSelect={handleSelect}
                key={seletedPerson?.name}
              />
            )}

            {/* <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div> */}
          </div>
        </div>

        {filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
