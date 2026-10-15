import React, { useContext, useState } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { auth, db } from "../../Utility/firebase";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { type } from "../../Utility/action.type";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Auth() {
  const [, dispatch] = useContext(DataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState({
    signIn: false,
    signup: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

  // Save the user's information in Firestore.
  const saveUserToFirestore = async (firebaseUser, isNewUser = false) => {
    const userRef = doc(db, "users", firebaseUser.uid);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      updatedAt: serverTimestamp(),
    };

    if (isNewUser) {
      userData.createdAt = serverTimestamp();
    }

    await setDoc(userRef, userData, { merge: true });
  };

  // Sign in an existing user.
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    setLoading((previous) => ({
      ...previous,
      signIn: true,
    }));

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const firebaseUser = userCredential.user;

      dispatch({
        type: type.SET_USER,
        user: firebaseUser,
      });

      // Ensure users/{uid} exists in Firestore.
      await saveUserToFirestore(firebaseUser);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Sign-in error:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Incorrect email or password. Please try again.");
      } else if (
        err.code === "permission-denied" ||
        err.code === "firestore/permission-denied"
      ) {
        setError(
          "You signed in, but Firestore denied access to your user document. Check your Firestore security rules.",
        );
      } else {
        setError(err.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading((previous) => ({
        ...previous,
        signIn: false,
      }));
    }
  };

  // Register a new user.
  const handleRegister = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    setLoading((previous) => ({
      ...previous,
      signup: true,
    }));

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const firebaseUser = userCredential.user;

      // Create users/{uid} in Firestore.
      await saveUserToFirestore(firebaseUser, true);

      dispatch({
        type: type.SET_USER,
        user: firebaseUser,
      });

      console.log("Registered user UID:", firebaseUser.uid);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Your password must contain at least 6 characters.");
      } else if (
        err.code === "permission-denied" ||
        err.code === "firestore/permission-denied"
      ) {
        setError(
          "Your account may have been created, but Firestore denied saving the user. Check your Firestore security rules.",
        );
      } else {
        setError(err.message || "Unable to create your account.");
      }
    } finally {
      setLoading((previous) => ({
        ...previous,
        signup: false,
      }));
    }
  };

  return (
    <section className={classes.login}>
      <Link to="/">
        <img
          src="https://pngimg.com/uploads/amazon/amazon_PNG25.png"
          alt="Amazon Logo"
        />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>

        <form onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className={classes.error} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={classes.login_signInButton}
            disabled={loading.signIn || loading.signup}
          >
            {loading.signIn ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p>
          By signing in, you agree to Amazon's Conditions of Use &amp; Sale.
          Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>

        <button
          type="button"
          onClick={handleRegister}
          className={classes.login_registerButton}
          disabled={loading.signIn || loading.signup}
        >
          {loading.signup
            ? "Creating your account..."
            : "Create your Amazon Account"}
        </button>
      </div>
    </section>
  );
}

export default Auth;
