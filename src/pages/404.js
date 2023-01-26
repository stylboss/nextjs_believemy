import Head from 'next/head';
import React from 'react';

function Error404() {
  return (
    <>
      <Head>
        <title>Erreur 404</title>
      </Head>
      erreur 404 <br />
      {"c'ette page n'existe pas."}
    </>
  );
}

export default Error404;