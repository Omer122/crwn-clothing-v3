import { createContext, useEffect, useReducer } from "react";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

import { createAction } from "../utils/reducer/reducer.utils";

// the actual value want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: ()=> null,
});


export const USER_ACTION_TYPES = {
  SET_CURRENT_USER:'SET_CURRENT_USER'
}

//Reducer define
const userReducer = (state, action) => {
  console.log('dispatched');
  console.log(action);
  const { type, payload } = action;

  // payload= what to update the state value with

  switch(type){
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return{
        ...state, //all the other values keep, except what I mention here
        currentUser:payload
      }
    default:
      throw new Error (`Unhandled type ${type} in userReducers`);
  }
}

const INITIAL_STATE = {
  currentUser:null
}

//wrap the app we want to deliver
export const UserProvider = ({ children }) =>{
    // const [currentUser, setCurrentUser] = useState(null);  // context use instead of reducer
    const [ state, dispatch ] = useReducer( userReducer, INITIAL_STATE )       //useReducer hook
    const {currentUser} = state;
    console.log( currentUser);

    const setCurrentUser = (user)=>{
      dispatch( createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user ));
    }

    const value = { currentUser, setCurrentUser };

    //manually signout since getAuth listens and keeps data on the sign in users
    // signOutUser();

    //run this function once when the component mounts [], sign out= null callback
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user){
                //getting a valid userDocRef (new or existing) either way
                createUserDocumentFromAuth(user); 
            }
            setCurrentUser(user); //user signs out- stores null, signs in - stores the object
        })
        return unsubscribe;
    },[] );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

//setting a cetralized placed to track all of the changes


/*
Reducers - functions that returns new object, receives current state& the action:

const userReducers = (state, action ) => {
  return{
    currentUser:
  }
}

*/