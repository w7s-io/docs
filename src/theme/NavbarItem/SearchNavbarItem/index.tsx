import React from 'react';
import SearchBar from '@theme/SearchBar';

type Props = {
  className?: string;
};

export default function SearchNavbarItem({className}: Props): React.ReactNode {
  return (
    <div className={className}>
      <SearchBar />
    </div>
  );
}
