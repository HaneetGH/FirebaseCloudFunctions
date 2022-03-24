const functions = require("firebase-functions");
// const fetch = require('fetch');
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
const authFirebase = require("firebase/auth")
const mConfig = require("./config")
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(mConfig.firebaseConfig);

//admin.initializeApp()

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addNpUsers = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
   // const original = req.query.text;

  
 var isUserExist = await isValidUser(req).catch((error) => {
  var response={
    "status_message": "Fail",
    "status_code":3,
    "data": {
      /* Application-specific data would go here. */
    },
    "message": "Fail due to "+error /* Or optional success message */
  }
  return res.json({result: response});
});;
//isUserExist=true;
  // idToken comes from the client app
  
  if(isUserExist){
  
    const userModel = {
    useremail: req.query.useremail,
    profession: req.query.profession,
    userDOB: req.query.userDOB,
    userID: req.query.userID,
    userLocation:req.query.userLocation,
    userName:req.query.userName,
    userType:"NP"
  };
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult =  await admin.firestore().collection('natualPerson').doc("NP-"+req.query.userID).set(userModel).catch((error) => {
    var response={
      "status_message": "Fail",
      "status_code":5,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Fail due to "+error /* Or optional success message */
    }
    return res.json({result: response});
  });;


  const userDetail = await admin.firestore()
  .collection("users")
  .where("userID", "==", req.query.userID)
  .get()
  .then((querySnapshot) => {
   return querySnapshot.docs
    // Users with > 1 book:  [ { id: 'user-1', count: 1 } ]
  });


  
  // Send back a message that we've successfully written the message
  var response={
    "status_message": "Success",
    "status_code":1,
    "data": {
    // userDetail:userDetail
    },
    "message": "User with Name: "+req.query.userName+" added Successfully." /* Or optional success message */
  }
  return res.json({result: response});

  }

  
  else if(!isUserExist){
  var response={
    "status_message": "Fail",
    "status_code":2,
    "data": {
      /* Application-specific data would go here. */
    },
    "message": "Session expires " /* Or optional success message */
  }
  return res.json({result: response});}
  else{
    var response={
      "status_message": "some fuck",
      "status_code":4,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Session expires " /* Or optional success message */
    }
    return res.json({result: response});
  }



 
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

  const isValidUser = async (req) => {

   let result = await admin.auth()
  .verifyIdToken(req.query.idToken)
  .then(async  (decodedToken) => {
    const uid = decodedToken.uid;
  
    if(uid == req.query.uid) {
      return true }
    else {
      return false }
    

  })
  .catch((error) => {
    return error
  });
return result

  };




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