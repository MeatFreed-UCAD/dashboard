import { initializeApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { 
  getFirestore, doc, getDoc, setDoc, 
  collection, getDocs, query, where
} from "firebase/firestore";
import firebaseConfig from './Secrets';

let app;
if (getApps().length === 0){
  app = initializeApp(firebaseConfig);
}
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

class Model {
  constructor() {
    this.listeners = [];
  }
  
  addListener(callbackFunction) {
    const listenerId = Date.now();
    const listener = {
      id: listenerId,
      callback: callbackFunction
    }
    this.listeners.push(listener);
    callbackFunction();
    return listenerId;
  }

  removeListener(listenerId) {
    let idx = this.listeners.findIndex((elem)=>elem.id===listenerId);
    this.listeners.splice(idx, 1);
  }

  notifyListener() {
    for (const tl of this.listeners) {
      tl.callback();
    }
  }
}
  
class DataModel extends Model {
  constructor() {
    super();
    this.restaurants = [];
    this.offers = [];
    this.name = "";
    this.numClicks = "";
    this.numOffers = "";
    this.place_id = "";
  }

  async fetchUserEmail(user) {
    const docSnap = await getDoc(doc(db, "users", user?.uid));
    if (docSnap.exists()){
      return docSnap.data().email;
    }
  }

  async fetchPlaceId(user) {
    if (this.place_id) {
      return this.place_id;
    }
    const email = await this.fetchUserEmail(user);
    const q = query(collection(db, "email2restaurant"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
      this.place_id = querySnapshot.docs[0].data().place_id
      return this.place_id;
    }
  }

  async fetchOfferData(user) {
    const place_id = await this.fetchPlaceId(user);
    if (place_id === undefined) {
      return;
    }
    const q = query(collection(db, "offers"), where("place_id", "==", place_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
      querySnapshot.forEach((doc) => {
        let offer = doc.data();
        offer.key = doc.id;
        this.offers.push(offer);
      });
      this.numOffers = querySnapshot.size;
      // console.log(this.offers);
      this.notifyListener();
    }
  }
  
  async fetchRestaurantInfo(user) {
    const place_id = await this.fetchPlaceId(user);
    if (place_id === undefined) {
      this.name = "unauthorized email"; 
      this.notifyListener();
      return;
    }
    const q = query(collection(db, "restaurants"), where("place_id", "==", place_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      // console.log(data);
      this.name = data.name;
      this.numClicks = data.clicksCount;
      this.notifyListener();
    }
  }

  async fetchRestaurantClicks(user) {
    const place_id = await this.fetchPlaceId(user);
    if (place_id === undefined) {
      return;
    }
    const q = query(collection(db, "restaurants"), where("place_id", "==", place_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docID = querySnapshot.docs[0].id;
      const docsSnap = await getDocs(collection(db, "restaurants/" + docID + "/clicks"));
      docsSnap.forEach((doc) => {
        // console.log(new Date(doc.data().time * 1000));
      })
    }
  }

  getRestaurantName() {
    return this.name;
  }

  getRestaurantClicks() {
    return this.numClicks;
  }

  getNumOffers() {
    return this.numOffers;
  }

  async fetchData() {
    const querySnapshot = await getDocs(collection(db, "restaurants"));
    let newList = [];
    querySnapshot.forEach((doc) => {
      let restaurant = doc.data();
      restaurant.key = doc.id;
      newList.push(restaurant);
    });
    this.restaurants = newList;
    this.notifyListener();
  }

  deconstructor() {
    this.restaurants = [];
    this.offers = [];
    this.name = "";
    this.numClicks = "";
    this.numOffers = "";
    this.place_id = "";
  }

  logout() {
    signOut(auth);
    this.deconstructor();
  };

}

class UserModel extends Model {
  constructor() {
    super();
    this.userName = '';
  }

  async fetchUserName(user) {
    const docSnap = await getDoc(doc(db, "users", user?.uid));
    if (docSnap.exists()){ 
      this.userName = docSnap.data().name;
      this.notifyListener();
    }
  }

  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          referralsCount: 0
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  async logInWithEmailAndPassword(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  async registerWithEmailAndPassword(name, email, password) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        referralsCount: 0
      });
    } catch (err) {
      alert(err.message);
    }
  };

  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  logout() {
    signOut(auth);
  };
}

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}

let theUserModel = undefined;

export function getUserModel() {
  if (!theUserModel) {
    theUserModel = new UserModel();
  }
  return theUserModel;
}

export { auth };