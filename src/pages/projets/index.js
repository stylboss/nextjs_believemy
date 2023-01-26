import React from 'react';
import CarteDeProjet from '@/component/CarteDeProjet/CarteDeProjet';
import { connectToDatabase } from '@/helpers/mongodb';
import Head from 'next/head';

function Projets(props) {
  return (
    <>
      <Head>
        <title>Mes projets</title>
      </Head>
      <main>projets</main>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {props.projets.map((projet) => (
          <CarteDeProjet key={projet._id} projet={projet} />
        ))}
      </div>
    </>
  );
}

export default Projets;

export async function getStaticProps() {
  let projets;

  try {
    const client = await connectToDatabase();
    const db = client.db();

    // recuperer mes projets
    projets = await db
      .collection('projets')
      .find()
      .sort({ dateDePublication: -1 })
      .toArray();
    projets = JSON.parse(JSON.stringify(projets));
  } catch (error) {
    projets = [];
  }
  return {
    props: {
      projets,
    },
  };
}