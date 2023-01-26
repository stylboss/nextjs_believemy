import React from 'react';
import Link from 'next/link';
import { connectToDatabase } from '@/helpers/mongodb';
import Head from 'next/head';

function Slug(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { titre, description, client, annee, slug } = props.projet;
  let displayClient = client;
  if (client == 'Projet personnel') {
    displayClient = 'perso';
  }

  return (
    <main>
      <Head>
        <title>{titre}</title>
      </Head>
      {titre}
      <button style={{ marginLeft: '15px' }}>
        <Link href={'/'}>accueil</Link>
      </button>
      <br />
      <small>
        <Link href={`/${displayClient}`}>{client}</Link>
        <br />
        Projet réalisé en {annee}.
      </small>
    </main>
  );
}

export default Slug;

export async function getServerSideProps(context) {
  let projetRecupere;
  let { params } = context;
  const slug = params.slug;

  try {
    const client = await connectToDatabase();
    const db = client.db();

    // recuperer mes projets
    projetRecupere = await db
      .collection('projets')
      .find({ slug: slug })
      .toArray();
    projetRecupere = JSON.parse(JSON.stringify(projetRecupere))[0];
  } catch (error) {
    projetRecupere = [];
  }

  if (!projetRecupere) {
    return {
      // notFound: true,
      redirect: {
        destination: '/',
      },
    };
  }

  return {
    props: {
      projet: projetRecupere,
    },
  };
}

// export async function getStaticPaths() {
//   let projets;

//   try {
//     const client = await connectToDatabase();
//     const db = client.db();

//     // Récupére tous les projets
//     projets = await db.collection('projets').find().toArray();
//   } catch (error) {
//     projets = [];
//   }

//   const dynamicPaths = projets.map((projet) => ({
//     params: { slug: projet.slug },
//   }));

//   return {
//     paths: dynamicPaths,
//     fallback: 'blocking',
//   };
// }

// export async function getStaticProps(context) {
// let projetRecupere;
// let { params } = context;
// const slug = params.slug;

// try {
//   const client = await connectToDatabase();
//   const db = client.db();

//   // recuperer mes projets
//   projetRecupere = await db
//     .collection('projets')
//     .find({ slug: slug })
//     .toArray();
//   projetRecupere = JSON.parse(JSON.stringify(projetRecupere))[0];
// } catch (error) {
//   projetRecupere = [];
// }

// if (!projetRecupere) {
//   return {
//     // notFound: true,
//     redirect: {
//       destination: '/',
//     },
//   };
// }

// return {
//   props: {
//     projet: projetRecupere,
//   },
//   revalidate: 3600,
// };
// }