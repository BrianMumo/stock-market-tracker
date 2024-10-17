// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Firebase Auth
  const auth = firebase.auth();
  
  // Sign up user
  function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('User signed up:', userCredential.user);
      })
      .catch(error => {
        console.error('Error signing up:', error.message);
      });
  }
  
  // Log in user
  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('User logged in:', userCredential.user);
      })
      .catch(error => {
        console.error('Error logging in:', error.message);
      });
  }
  
  // Log out user
  function logout() {
    auth.signOut()
      .then(() => {
        console.log('User logged out');
      });
  }
  