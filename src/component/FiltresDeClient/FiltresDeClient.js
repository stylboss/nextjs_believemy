import Link from 'next/link';
import React from 'react';

function FiltresDeClient(props) {
  return (
    <main>
      <button>
        <Link href={`/${props.client}`}>Tout</Link>
      </button>
      {props.annees.map((annee, index) => (
        <button key={index}>
          <Link href={`/${props.client}/${annee}`}>{annee}</Link>
        </button>
      ))}
    </main>
  );
}

export default FiltresDeClient;