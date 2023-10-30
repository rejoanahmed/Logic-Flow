// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDoJnx7zWipvD4zdVK3NjxkiA4ob9JyAGk',
  authDomain: 'ably-logic-flow.firebaseapp.com',
  projectId: 'ably-logic-flow',
  storageBucket: 'ably-logic-flow.appspot.com',
  messagingSenderId: '830017837719',
  appId: '1:830017837719:web:b44768f91219edb78ba7d2'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
