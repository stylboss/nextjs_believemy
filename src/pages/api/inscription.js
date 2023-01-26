import { hashPassword } from '@/helpers/auth';
import { connectToDatabase } from '@/helpers/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pseudo, email } = req.body;
    let { password } = req.body;

    // Vérifier que tous les champs soient remplis
    if (!pseudo || !email || !password) {
      res.status(422).json({
        message: 'Champs du formulaire manquant.',
      });
      return;
    }

    // Etape intermediaire indispensable : sécuriser le mot de passe
    password = await hashPassword(password);

    // Stocker le nouvel utilisateur
    const nouvelUtilisateur = {
      pseudo,
      email,
      password,
      roles: ['utilisateur'],
      //dateDeCreation : new Date()
    };

    // Vérifier la syntaxe de l'email
    const pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(email)) {
      res.status(406).json({
        message: 'Votre adresse email est invalide. ',
      });
    }

    // Connexion à MongoDB
    let clientMongoDB;
    try {
      clientMongoDB = await connectToDatabase();
    } catch (error) {
      res.status(500).json({
        message: "Impossible d'effectuer la requête. ",
      });
      return;
    }

    const db = clientMongoDB.db();
    let emailDejaUtilise;

    // Vérifier que l'adresse email n'est pas utilisée
    try {
      emailDejaUtilise = await db.collection('utilisateurs').findOne({ email });
    } catch (error) {
      clientMongoDB.close();
      res.status(500).json({
        message: 'Un problème est survenu. ',
      });
      return;
    }

    if (emailDejaUtilise) {
      clientMongoDB.close();
      res.status(403).json({
        message: 'Cette adresse email est déja utilisée. ',
      });
      return;
    }

    // Insérer un nouvel utilisateur
    try {
      await db.collection('utilisateurs').insertOne(nouvelUtilisateur);
    } catch (error) {
      clientMongoDB.close();
      res.status(500).json({
        message: 'Un problème est survenu. ',
      });
      return;
    }

    // Succès
    clientMongoDB.close();
    res.status(201).json({
      message: 'Utilisateur enregistré avec succès. ',
      utilisateur: nouvelUtilisateur,
    });
  } else {
    res.status(405).json({
      message: 'Une erreur est survenue. ',
    });
  }
}