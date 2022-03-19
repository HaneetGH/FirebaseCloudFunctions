const functions = require("firebase-functions");
// const fetch = require('fetch');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const authFirebase = require("firebase/auth")
var serviceAccount = require("./serviceAccountKey.json");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//admin.initializeApp({
 //credential: admin.credential.cert(serviceAccount),
 //////databaseURL: "https://healthscore-4fcdf-default-rtdb.firebaseio.com"
//});

admin.initializeApp()

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addusers = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
   // const original = req.query.text;

  // var isUserExist = await this.isValidUser(req.query.idToken,req.query.uid);

  // idToken comes from the client app

  
await admin.auth()
  .verifyIdToken(req.query.idToken)
  .then(async  (decodedToken) => {
    const uid = decodedToken.uid;
    if(uid == req.query.uid)
    {
      const userModel = {
        useremail: req.query.useremail,
        profession: req.query.profession,
        userDOB: req.query.userDOB,
        userID: req.query.userID,
        userLocation:req.query.userLocation,
        userName:req.query.userName
      };
      // Push the new message into Firestore using the Firebase Admin SDK.
      const writeResult =  await admin.firestore().collection('users').add(userModel);
      // Send back a message that we've successfully written the message
      res.json({result: `Message with ID: ${writeResult.id} added.`});
    }
    else{
      res.json({result: false});
    }
    // ...
  })
  .catch((error) => {
    res.json({result: error});
  });







 
  });

  exports.generateToken = functions.https.onRequest(async (req, res) => {

    admin.auth()
  .createCustomToken(req.query.uid)
  .then((customToken) => {
    res.json({result: customToken});
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
    res.json({result: error});
  });
  });

  exports.isValidUser = functions.https.onRequest(async (req, res) => {

    


  });




  exports.getAllUsers = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
   // const original = req.query.text;

   
  var writeResult =await db.collection("users").get().then((querySnapshot) => {
    res.json({result: querySnapshot});
});
res.json({result: `Message with ID: ${writeResult} added.`});
    
  });

  // Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Firestore.
      // Setting an 'uppercase' field in Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });