import serviceAccount from "../firebase-service-account.json";
import firebaseAdmin, { ServiceAccount } from "firebase-admin";
firebaseAdmin.initializeApp({
	// credential: firebaseAdmin.credential.applicationDefault(),
	credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
});

export default firebaseAdmin;
