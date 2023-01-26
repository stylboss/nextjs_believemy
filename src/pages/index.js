import CarteDeProjet from '@/component/CarteDeProjet/CarteDeProjet';
import { connectToDatabase } from '@/helpers/mongodb';
import { getSession, signOut } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

function Index(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const onDeleteClickedHandler = async () => {
    if (!isLoading) {
      setIsLoading(true);
      setError(null);

      // Envoyer ma demande de supression
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const fetchedData = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(fetchedData.message || 'Une erreur est survenue');
      } else {
        setIsLoading(false);
        signOut();
      }
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <Head>
        <title>Le portfolio de reseau</title>
      </Head>
      bienvenue {props.user ? props.user.name : 'sur le reseau'}
      <div
        style={{
          color: 'white',
          border: '1px solid #9f7aea',
          borderRadius: '5px',
          padding: '15px',
          transition: 'all 0.3s',
          fontWeight: 'normal',
          display: 'flex',
          gap: '15px',
          textTransform: 'lowercase',
          justifyContent: 'space-between',
        }}
      >
        Je m{"'"}appelle réseau je suis développeur full-stack, je maitrise de
        nombreuses technologies. Envie de collaborer avec moi ?
        <button
          style={{
            color: 'white',
            backgroundColor: '#4299e1',
            borderRadius: '7px',
            padding: '1px',
            fontSize: '10px',
            height: '29px',
          }}
        >
          <a href="mailto:moi@gmail.com">Contactez-moi !</a>
        </button>
        {props.user &&
          (isLoading ? (
            <SpinnerDotted
              size={25}
              thickness={100}
              speed={100}
              color="white"
            />
          ) : (
            <button onClick={onDeleteClickedHandler}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ widht: '15px', height: '15px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          ))}
        <div>
          <Image
            src="/bali4k.jpeg"
            alt="Moi"
            width={75}
            height={75}
            style={{
              borderRadius: '50%',
              minHeight: '55px',
              minWidth: '55px',
            }}
          />
        </div>
      </div>
      Mes derniers projets
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
    </main>
  );
}

export default Index;

export async function getServerSideProps(context) {
  let projets;
  const session = await getSession({ req: context.req });
  let user = null;

  if (session) {
    user = session.user;
  }

  try {
    // connexion MongoDB
    const client = await connectToDatabase();
    const db = client.db();

    projets = await db
      .collection('projets')
      .find()
      .sort({ dateDePublication: -1 })
      .limit(3)
      .toArray();
    projets = JSON.parse(JSON.stringify(projets));
  } catch (error) {
    console.log(error);
    projets = [];
  }

  return {
    props: {
      projets,
      user,
    },
  };
}