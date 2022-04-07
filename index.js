const ERROR_CODE = {
  SUCCESS: 1,
  FAIL: 2,
  EXCEPTION:3,
  NOT_THAT_SUCCESS:4

};

const ERROR_MSG = {
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
  EXCEPTION: "SYSTEM EXCEPTION",
  NOT_THAT_SUCCESS:"NOT_THAT_SUCCESS"
};

const DOCUMENTS ={
  USERS:"natualPerson"
}

Object.freeze(ERROR_CODE)
Object.freeze(ERROR_MSG)
Object.freeze(DOCUMENTS)

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const authFirebase = require("firebase/auth")
const mConfig = require("./config")
//const mConstants = require("./constants")
admin.initializeApp(mConfig.firebaseConfig);
const dbConnection = admin.firestore()


  exports.isProfileThere = functions.https.onRequest(async (req, res) => {

  var isUserExist = await isValidUser(req).catch((error) => {
    var response={
      "status_message": ERROR_MSG.EXCEPTION,
      "status_code":ERROR_CODE.EXCEPTION,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Fail due to "+error /* Or optional success message */
    }
    return res.json({result: response});
  });;

  if(isUserExist){
    await dbConnection.collection(DOCUMENTS.USERS).doc(req.query.uid).get()
    .then(async (docSnapshot) => {
      if (docSnapshot.exists) {
        var response={
          "status_message": "Success",
          "status_code":1,
          "data": {
        
          },
          "message": "User profile found " /* Or optional success message */
        }
        return res.json({result: response});
      } else {
        var response={
          "status_message": ERROR_MSG.FAIL,
          "status_code":ERROR_CODE.FAIL,
          "data": {
           data:docSnapshot
          },
          "message": "User profile not found " /* Or optional success message */
        }
        return res.json({result: response});
      }
  }).catch((error) => {
    var response={
      "status_message": ERROR_MSG.EXCEPTION,
      "status_code":ERROR_CODE.EXCEPTION,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Fail due to "+error /* Or optional success message */
    }
    return res.json({result: response});
  });
  }
  else if(!isUserExist){
    var response={
      "status_message": ERROR_MSG.FAIL,
      "status_code":ERROR_CODE.FAIL,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "User Not There" /* Or optional success message */
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
 

   })
//--------------------------------------------//
  exports.addNpUsers = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
   // const original = req.query.text;

  
 var isUserExist = await isValidUser(req).catch((error) => {
  var response={
    "status_message": ERROR_MSG.EXCEPTION,
    "status_code":ERROR_CODE.EXCEPTION,
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
  const writeResult =  dbConnection.collection(DOCUMENTS.USERS).doc(req.query.userID).set(userModel).catch((error) => {
    var response={
      "status_message": ERROR_MSG.EXCEPTION,
      "status_code":ERROR_CODE.EXCEPTION,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Fail due to "+error /* Or optional success message */
    }
    return res.json({result: response});
  });;


  const userDetail = await dbConnection
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
    "status_message": ERROR_MSG.NOT_THAT_SUCCESS,
    "status_code":ERROR_CODE.NOT_THAT_SUCCESS,
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


//--------------------------------------------//
exports.getAllLabs = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
 // const original = req.query.text;


var isUserExist = await isValidUser(req).catch((error) => {
var response={
  "status_message": ERROR_MSG.EXCEPTION,
  "status_code":ERROR_CODE.EXCEPTION,
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

  const snapshot = await dbConnection.collection("labsDetails").get();
var labsDetails= snapshot.docs.map(doc => doc.data());
// Send back a message that we've successfully written the message
var response={
  "status_message": "Success",
  "status_code":1,
  "data": {
    labs:labsDetails
  },
  "message": "" /* Or optional success message */
}
return res.json({result: response});

}
else if(!isUserExist){
var response={
  "status_message": ERROR_MSG.NOT_THAT_SUCCESS,
  "status_code":ERROR_CODE.NOT_THAT_SUCCESS,
  "data": {
    /* Application-specific data would go here. */
  },
  "message": "User Not Found " /* Or optional success message */
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
    var response={
      "status_message": ERROR_MSG.EXCEPTION,
      "status_code":ERROR_CODE.EXCEPTION,
      "data": {
        /* Application-specific data would go here. */
      },
      "message": "Fail due to "+error /* Or optional success message */
    }
    res.json({result: response});
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
