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
  USERS:"natualPerson",
  TEST:"labsTestMaster"
}

Object.freeze(ERROR_CODE)
Object.freeze(ERROR_MSG)
Object.freeze(DOCUMENTS)
const express = require('express');

const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const firebase = require("firebase/app")
const authFirebase = require("firebase/auth")
const mConfig = require("./config")
const mCred = require("./cred")
//const mConstants = require("./constants")
admin.initializeApp(mConfig.firebaseConfig);
const dbConnection = admin.firestore()

const app = express();
const main = express();
//add the path to receive request and set json as bodyParser to process the body 
main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

app.get('/isProfileThere', async (req, res) => {

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
//-------------addNpUsers-------------------//

app.post('/addNpUsers', async(req, res) => {
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

app.get('/getAllLabs', async(req, res) => {
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


  app.get('/generateToken', async(req, res) => {

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

app.get('/sendVerificationEmail', async(req, res) => {

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mCred.BASE_EMAIL,
          pass: mCred.BASE_EMAIL_PASS
        }
      });
      
      var mailOptions = {
        from: mCred.BASE_EMAIL,
        to: req.query.email,
        subject: 'TechnoRapper ChatBot Message',
        text: 'Your verification code is '+ req.query.code
      };

     await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({result: `Message with ID: ${error} added.`});
        } else {
          res.json({result: `True`});
        }
      });

      });

app.get('/sendEmail', async(req, res) => {

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mCred.BASE_EMAIL,
          pass: mCred.BASE_EMAIL_PASS
          }
        });
        
        var mailOptions = {
          from: mCred.BASE_EMAIL,
          to: req.query.email,
          subject: 'TechnoRapper ChatBot Message',
          text: req.query.msg
        };
  
       await transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.json({result: `Message with ID: ${error} added.`});
          } else {
            res.json({result: `True`});
          }
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
    app.get('/getAllUsers', async (req, res) => {
    // Grab the text parameter.
   // const original = req.query.text;

   
  var writeResult =await db.collection("users").get().then((querySnapshot) => {
    res.json({result: querySnapshot});
});
res.json({result: `Message with ID: ${writeResult} added.`});
    
  });





/************SendLabDetails************************* */

app.get('/sendLabDetails', async(req, res) => {
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
  const testModel = {
  labId: req.query.labId,
  testCatId: req.query.testCatId,
  testID: req.query.testID,
  testName:req.query.testName,
  testPrice:req.query.testPrice,
  testActive:req.query.testActive,
  testRange:req.query.testRange
};
// Push the new message into Firestore using the Firebase Admin SDK.
const writeResult =  dbConnection.collection(DOCUMENTS.TEST).doc(req.query.labId).collection(req.query.testCatId).doc(req.query.testID).set(testModel).catch((error) => {
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


// Send back a message that we've successfully written the message
var response={
  "status_message": "Success",
  "status_code":1,
  "data": {
  // userDetail:userDetail
  },
  "message": "Lab added Successfully." /* Or optional success message */
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
 /************SendLabDetails************************* */
 //app.disable("x-powered-by");

 app.get('/yes', (req, res) => {
  res.send('Hello World!')
})
// Mask the global 'window' for this snippet file
/*const window = {
  recaptchaVerifier: undefined
};

window.recaptchaVerifier = authFirebase.RecaptchaVerifier('sign-in-button', {
  'size': 'invisible',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    onSignInSubmit();
  }
});

function onSignInSubmit() {
function phoneSignIn() {
  function getPhoneNumberFromUserInput() {
    return "+917293000040";
  }

  // [START auth_phone_signin]
  const phoneNumber = getPhoneNumberFromUserInput();
  const appVerifier = window.recaptchaVerifier;
  authFirebase.signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });
  // [END auth_phone_signin]
}
}*/

// This line is important. What we are doing here is exporting ONE function with the name
// `api` which will always route

exports.api = functions.https.onRequest(main);
