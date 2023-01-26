import { connectToDatabase } from '@/helpers/mongodb';
import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Impossible de vous authentifier' });
      return;
    }

    // Connexion à MongoDB
    let clientMongoDB;
    try {
      clientMongoDB = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Impossible de se connecter db' });
      return;
    }

    const db = clientMongoDB.db();

    // Supprimer l'utilisateur connecter
    try {
      await db
        .collection('utilisateurs')
        .deleteOne({ email: session.user.email });
    } catch (error) {
      clientMongoDB.close();
      res
        .status(500)
        .json({ message: 'Impossible de supprimer cet utilisateur' });
      return;
    }

    // Succès
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    return;
  } else {
    res.status(403).json({ message: 'methode requête invalide' });
    return;
  }
}