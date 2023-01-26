import { verifypassword } from '@/helpers/auth';
import { connectToDatabase } from '@/helpers/mongodb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // Email mdp
        const { email, password } = credentials;

        // connexion à MongoDB
        const clientMongoDB = await connectToDatabase();

        // l'utilisateur existe-t-il ?
        const utilisateur = await clientMongoDB
          .db()
          .collection('utilisateurs')
          .findOne({ email });

        if (!utilisateur) {
          clientMongoDB.close();
          throw new Error('Utilisateur non trouvé');
        }

        // mdp correct avec celui enregistré ?
        const isValid = await verifypassword(password, utilisateur.password);

        if (!isValid) {
          clientMongoDB.close();
          throw new Error('mdp incorrect');
        }

        // Succès
        clientMongoDB.close();
        return {
          email: utilisateur.email,
          name: utilisateur.pseudo,
          id: utilisateur._id,
          roles: utilisateur.roles,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return token;
    },
    session: async (session, user) => {
      session.user = user.user;
      return session;
    },
  },
});