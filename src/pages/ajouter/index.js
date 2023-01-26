import Error from '@/component/ui/Error/Error';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SpinnerDotted } from 'spinners-react';

function Ajouter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  // States
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();

  const onSubmittedHandler = async (data) => {
    if (!isLoading) {
      setisLoading(true);
      setError(null);
      // Envoyer le nouveau projet sur notre API Next
      const response = await fetch('api/projet', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const fetchedData = await response.json();

      if (!response.ok) {
        setisLoading(false);
        setError(fetchedData.message || "une erreur est survenue dans l'API");
      } else {
        setisLoading(false);
        router.push(`/projets/${fetchedData.projet.slug}`);
      }
    }
  };

  return (
    <section style={{ display: 'flex', justifyContent: 'center' }}>
      <main style={{ width: '300px' }}>
        <Head>
          <title>Ajouter un article</title>
        </Head>
        Ajouter un projet
        <br />
        {(errors.titre ||
          errors.slug ||
          errors.client ||
          errors.annee ||
          errors.description ||
          errors.contenu) && (
          <Error>Veuillez remplir tous les champs du formulaire.</Error>
        )}{' '}
        {error && <Error> {error} </Error>}
        <form onSubmit={handleSubmit(onSubmittedHandler)}>
          <p>
            <label htmlFor="titre">Titre</label>
            <input
              id="titre"
              placeholder="Titre du projet"
              {...register('titre', { required: true })}
            />
          </p>
          <p>
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              placeholder="Slug du projet"
              {...register('slug', { required: true })}
            />
          </p>
          <p>
            <label htmlFor="client">Client</label>
            <input
              id="client"
              placeholder="Client associé au projet"
              {...register('client', { required: true })}
            />
          </p>
          <p>
            <label htmlFor="annee">Année</label>
            <input
              id="annee"
              placeholder="Année de création du projet"
              {...register('annee', { required: true })}
            />
          </p>
          <p>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Description du projet"
              rows={5}
              {...register('description', { required: true })}
            />
          </p>
          <p>
            <label htmlFor="contenu">Contenu</label>
            <textarea
              id="contenu"
              placeholder="Contenu du projet"
              rows={5}
              {...register('contenu', { required: true })}
            />
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <button>
              {isLoading ? (
                <SpinnerDotted
                  size={25}
                  thickness={100}
                  speed={100}
                  color="white"
                />
              ) : (
                'Ajouter'
              )}
            </button>
          </div>
        </form>
      </main>
    </section>
  );
}

export default Ajouter;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/connexion',
        permanent: false,
      },
    };
  }

  if (session && !session.user.roles.includes('administrateur')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}