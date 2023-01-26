import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSession, signin } from 'next-auth/client';
import { SpinnerDotted } from 'spinners-react';
import { useRouter } from 'next/router';
import Error from '@/component/ui/Error/Error';

function Connexion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  // States
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState();

  const onFormSubmittedHandler = async (data) => {
    setisLoading(true);
    setError(null);
    const resultat = await signin('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setisLoading(false);

    if (resultat.error) {
      setError(resultat.error);
    } else {
      router.replace('/');
    }
  };

  return (
    <main>
      Connexion
      {error && <Error>{error}</Error>}
      <form onSubmit={handleSubmit(onFormSubmittedHandler)}>
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
        <button style={{ width: '150px', marginLeft: '37px' }}>
          {isLoading ? (
            <SpinnerDotted
              size={25}
              thickness={100}
              speed={100}
              color="white"
            />
          ) : (
            'Je me connecte'
          )}
        </button>
      </form>
    </main>
  );
}

export default Connexion;

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