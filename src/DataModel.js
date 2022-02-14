import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, doc, getDoc, setDoc, updateDoc,
  collection, getDocs
} from "firebase/firestore";
import firebaseConfig from './Secrets';

let app;
if (getApps().length == 0){
  app = initializeApp(firebaseConfig);
} 
const db = getFirestore(app);
  
class DataModel {
  constructor() {
    this.restaurants = [];
    this.listeners = [];
    this.fetchData();
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
    // console.log(this.restaurants);
    this.notifyListener();
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

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}