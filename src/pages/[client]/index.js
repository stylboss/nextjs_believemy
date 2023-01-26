import React from 'react';
import { useRouter } from 'next/router';
import CarteDeProjet from '@/component/CarteDeProjet/CarteDeProjet';
import FiltresDeClient from '@/component/FiltresDeClient/FiltresDeClient';
import { connectToDatabase } from '@/helpers/mongodb';
import Head from 'next/head';

function ProjetsDuClient(props) {
  const router = useRouter();
  let nomDuClient = router.query.client;

  if (nomDuClient === 'perso') {
    nomDuClient = 'projets personnels';
  } else {
    nomDuClient = `projets de ${nomDuClient}`;
  }

  return (
    <>
      <Head>
        <title>{nomDuClient}</title>
      </Head>
      {nomDuClient} <br />
      <FiltresDeClient client={router.query.client} annees={props.annees} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        {props.projets.map((projet) => (
          <CarteDeProjet key={projet._id} projet={projet} />
        ))}
      </div>
    </>
  );
}

export default ProjetsDuClient;

export async function getStaticPaths() {
  // connexion à MongoDB
  const client = await connectToDatabase();
  const db = client.db();

  // Récupérer les projets
  const projets = await db.collection('projets').find().toArray();

  let arrayPaths = projets.map((projet) => {
    if (projets.client == 'Projet personnel') {
      return 'perso';
    } else {
      return projet.client;
    }
  });
  arrayPaths = [...new Set(arrayPaths)];
  const dynamicPaths = arrayPaths.map((path) => ({
    params: { client: path },
  }));

  return {
    paths: dynamicPaths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  let projets;
  let annees;
  const { params } = context;
  let clientParam = params.client;

  if (clientParam == 'perso') {
    clientParam = 'Projet personnel';
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();

    // recuperer mes projets
    projets = await db
      .collection('projets')
      .find({ client: clientParam })
      .sort({ dateDePublication: 1 })
      .toArray();
    projets = JSON.parse(JSON.stringify(projets));

    annees = projets.map((projet) => projet.annee);
    annees = [...new Set(annees)];
  } catch (error) {
    projets = [];
  }
  return {
    props: {
      projets,
      annees,
    },
    revalidate: 3600,
  };
}