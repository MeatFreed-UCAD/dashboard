import { initializeApp, getApps } from "firebase/app";
import * as dayjs from "dayjs";
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
  getFirestore, doc, getDoc, setDoc, addDoc, deleteDoc, updateDoc,
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
    this.emails = [];
    this.name = "";
    this.numClicks = "";
    this.numOffers = "";
    this.place_id = "";

    //collection for restaurant clicks
    this.restaurantClickData = [];

    //collection for offer clicks
    this.offerClickData = [];
  }

  async fetchUserEmail(user) {
    const docSnap = await getDoc(doc(db, "users", user?.uid));
    if (docSnap.exists()){
      return docSnap.data().email;
    }
  }

  async fetchAssociatedEmails(placeId) {
    const q = query(collection(db, "email2business"), where("place_id", "==", placeId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      this.emails = [];
      querySnapshot.forEach((doc) => {
        let email = doc.data();
        email.key = doc.id;
        this.emails.push(email);
      });
      this.notifyListener();
    }
  }

  async fetchPlaceId(user) {
    if (this.place_id) {
      return this.place_id;
    }
    const email = await this.fetchUserEmail(user);
    const q = query(collection(db, "email2business"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
      this.place_id = querySnapshot.docs[0].data().place_id
      return this.place_id;
    }
  }

  async fetchOfferData(user, placeId=null) {
    const place_id = placeId ? placeId : await this.fetchPlaceId(user);
    if (place_id === undefined) {
      return;
    }
    const q = query(collection(db, "offers"), where("place_id", "==", place_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty){
      this.offers = [];
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
      console.log("rest doc id = " + docID);
      const docsSnap = await getDocs(collection(db, "restaurants/" + docID + "/clicks"));
      //creating an array from the restaurant clicks docsSnap
      docsSnap.forEach((doc) => {
        let restaurantClick = doc.data();
        restaurantClick.key = doc.id;
        //date for sorting
        restaurantClick.date = doc.data().time * 1000;

        //date for display - formatted with dayjs
        restaurantClick.dateFormatted = dayjs(doc.data().time * 1000).format('MMM DD')

        //data pushed to restaurantClickData array
        this.restaurantClickData.push(restaurantClick);
      })
    }
  }


  async fetchOfferClicks(user) {
    const place_id = await this.fetchPlaceId(user);
    console.log(place_id)
    if (place_id === undefined) {
      return;
    }
    const q = query(collection(db, "offers"), where("place_id", "==", place_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docID = querySnapshot.docs[0].id;
      console.log("offer doc id = " + docID);
      const docsSnap = await getDocs(collection(db, "offers/" + docID + "/clicks"));
      //creating an array from the restaurant clicks docsSnap
      docsSnap.forEach((doc) => {
        let offerClick = doc.data();
        console.log(offerClick);
        offerClick.key = doc.id;
        //date for sorting
        offerClick.date = doc.data().time * 1000;

        //date for display - formatted with dayjs
        offerClick.dateFormatted = dayjs(doc.data().time * 1000).format('MMM DD')

        console.log(offerClick);
        //data pushed to restaurantClickData array
        this.offerClickData.push(offerClick);
      })
    }
  }

  addItem = async (item) => {
    let docRef = await addDoc(collection(db, "restaurants"), item);
    item.key = docRef.id;
    this.restaurants.push(item);
    this.notifyListener();
  }

  deleteItem = async (key) => {
    const docRef = doc(db, "restaurants", key);
    await deleteDoc(docRef);
    let idx = this.restaurants.findIndex((elem)=>elem.key===key);
    this.restaurants.splice(idx, 1);
    this.notifyListener();
  }

    
  updateItem = async (key, newItem) => {
    const docRef = doc(db, "restaurants", key);
    await updateDoc(docRef, newItem);
    let idx = this.restaurants.findIndex((elem)=>elem.key===key);
    this.restaurants[idx] = newItem;
    this.notifyListener();
  }

  addEmail = async (item) => {
    let docRef = await addDoc(collection(db, "email2business"), item);
    item.key = docRef.id;
    this.emails.push(item);
    this.notifyListener();
  }

  deleteEmail = async (key) => {
    const docRef = doc(db, "email2business", key);
    await deleteDoc(docRef);
    let idx = this.emails.findIndex((elem)=>elem.key===key);
    this.emails.splice(idx, 1);
    this.notifyListener();
  }

  getRestaurantName() {
    return this.name;
  }

  getRestaurantClicks() {
    return this.numClicks;
  }

  //passing the restaurant click data
  getRestaurantClickData() {
    return this.restaurantClickData;
  }

  getNumOffers() {
    return this.numOffers;
  }

  getOfferClickData() {
    return this.offerClickData;
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

  logout() {
    signOut(auth);
  };
}

class UserModel extends Model {
  constructor() {
    super();
    this.userName = '';
    this.isAdmin = false;
    this.userEmail = '';
  }

  async fetchUserName(user) {
    const docSnap = await getDoc(doc(db, "users", user?.uid));
    if (docSnap.exists()){ 
      this.userName = docSnap.data().name;
      this.notifyListener();
    }
  }

  async fetchAdmin(user) {
    const docSnap = await getDoc(doc(db, "users", user?.uid));
    if (docSnap.exists()){ 
      this.isAdmin = docSnap.data().admin;
      this.notifyListener();
    }
  }

  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      this.userEmail = user.email;
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

class AdminModel extends Model {
  constructor() {
    super();
    this.users = [];
  }
  async fetchUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    let newList = [];
    querySnapshot.forEach((doc) => {
      let user = doc.data();
      user.key = doc.id;
      newList.push(user);
    });
    this.users = newList;
    console.log(this.users);
    this.notifyListener();
  }

  updateItem = async (key, newItem) => {
    const docRef = doc(db, "users", key);
    await updateDoc(docRef, newItem);
    let idx = this.users.findIndex((elem)=>elem.key===key);
    this.users[idx] = newItem;
    this.notifyListener();
  }

  deleteItem = async (key) => {
    const docRef = doc(db, "user", key);
    await deleteDoc(docRef);
    let idx = this.users.findIndex((elem)=>elem.key===key);
    this.users.splice(idx, 1);
    this.notifyListener();
  }
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

let theAdminModel = undefined;

export function getAdminModel() {
  if (!theAdminModel) {
    theAdminModel = new AdminModel();
  }
  return theAdminModel;
}

export { auth };