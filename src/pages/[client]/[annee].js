import React from 'react';
import { useRouter } from 'next/router';
import CarteDeProjet from '@/component/CarteDeProjet/CarteDeProjet';
import FiltresDeClient from '@/component/FiltresDeClient/FiltresDeClient';
import { connectToDatabase } from '@/helpers/mongodb';
import Head from 'next/head';

function ProjetsDuClientFiltre(props) {
  const router = useRouter();
  let nomDuClient = router.query.client;
  const annee = router.query.annee;

  if (nomDuClient === 'perso') {
    nomDuClient = `projets personnels (${annee})`;
  } else {
    nomDuClient = `projets de ${nomDuClient} (${annee})`;
  }

  return (
    <>
      <Head>
        <title>{nomDuClient}</title>
      </Head>
      {nomDuClient}
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

export default ProjetsDuClientFiltre;

export async function getStaticPaths() {
  // connexion à MongoDB
  const client = await connectToDatabase();
  const db = client.db();

  // Récupérer les projets
  const projets = await db.collection('projets').find().toArray();

  let arrayPaths = projets.map((projet) => {
    if (projets.client == 'Projet personnel') {
      return ['perso', projet.annee];
    } else {
      return [projet.client, projet.annee];
    }
  });
  // arrayPaths = [...new Set(arrayPaths)];
  const dynamicPaths = arrayPaths.map((path) => ({
    params: { client: path[0], annee: path[1].toString() },
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
  let anneeParam = +params.annee;

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

    projets = projets.filter((projet) => projet.annee == anneeParam);
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