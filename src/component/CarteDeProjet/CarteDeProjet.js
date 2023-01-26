import React from 'react';
import classes from './CarteDeProjet.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';

function CarteDeProjet(props) {
  const router = useRouter();
  const { titre, description, annee, slug, client } = props.projet;

  return (
    <Link href={`/projets/${slug}`}>
      <main className={classes.CarteDeProjet}>
        <h3>{titre}</h3>
        <p>{description}</p>
      </main>
    </Link>
  );
}

export default CarteDeProjet;