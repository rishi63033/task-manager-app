const admin = require("firebase-admin");
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authenticateFirebase = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // now req.user.uid will exist
   
    next();
  } catch (err) {
    console.error("Firebase token verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateFirebase;
