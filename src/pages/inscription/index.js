import Error from '@/component/ui/Error/Error';
import { getSession } from 'next-auth/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SpinnerDotted } from 'spinners-react';

function Inscription() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // States
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();
  const [isRegistered, setIsRegistered] = useState(false);

  const onFormSubmittedHandler = async (data) => {
    if (!isLoading) {
      setisLoading(true);
      setError(null);
      // Envoyer le nouveau projet sur notre API Next
      const response = await fetch('api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const fetchedData = await response.json();

      if (!response.ok) {
        setisLoading(false);
        setError(fetchedData.message || "une erreur est survenue dans l'API");
      } else {
        setisLoading(false);
        setIsRegistered(fetchedData.utilisateur);
      }
    }
  };

  return (
    <main>
      Inscription
      {error && <Error>{error}</Error>}
      {isRegistered ? (
        ` Félicitation ${isRegistered.pseudo} ! vous pouvez maintenant vous connecter. `
      ) : (
        <form onSubmit={handleSubmit(onFormSubmittedHandler)}>
          <p>
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              placeholder="Pseudo"
              {...register('pseudo', { required: true })}
            />
            {errors.pseudo && (
              <small style={{ color: 'white' }}>
                Veuillez renseigner ce champ.
              </small>
            )}
          </p>
          <p>
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              placeholder="Adresse email"
              {...register('email', {
                required: true,
                pattern:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
            />
            {errors.email && errors.email.type === 'required' && (
              <small style={{ color: 'white' }}>
                Veuillez renseigner ce champ.
              </small>
            )}
            {errors.email && errors.email.type === 'pattern' && (
              <small style={{ color: 'white' }}>
                Votre adresse email n&apos; est pas
                <br />
                correct, vérifier de nouveau.
              </small>
            )}
          </p>
          <p>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              placeholder="Mot de passe"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <small style={{ color: 'white' }}>
                Veuillez renseigner ce champ.
              </small>
            )}
          </p>
          <button>
            {isLoading ? (
              <SpinnerDotted
                size={25}
                thickness={100}
                speed={100}
                color="white"
              />
            ) : (
              "Je m' inscris"
            )}
          </button>
        </form>
      )}
    </main>
  );
}

export default Inscription;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
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