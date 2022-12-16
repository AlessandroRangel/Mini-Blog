import { async } from '@firebase/util';
import { db } from '../firebase/config';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth';
import { useState, useEffect } from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //cleanup
    //deal with memory leak

    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    function checkIfIsCancelled () {
        if(cancelled) {
            return;
        }
    }
    //register

    const createUser = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError('');

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(user, {displayName: data.displayName});
            return user;
        } catch (error) {
            let systemErrorMessage 
            if(error.message.includes('Password')) {
                systemErrorMessage = 'A senha deve conter 6 ou mais caracteres.';
            }else if(error.message.includes('email-already')) {
                systemErrorMessage = 'E-mail já cadastrado';
            }else {
                systemErrorMessage = 'Ocorreu um erro, por favor tente mais tarde.'
            }
            setError(systemErrorMessage);
        }finally{
            setLoading(false);  
        }
        
    }
    
    //logout
    const logout = () => {
        checkIfIsCancelled();
        signOut(auth);
    }

    //login

    const login = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError('');

        try {
            
            await signInWithEmailAndPassword(auth, data.email, data.password);

        } catch (error) {
            let systemErrorMessage;
            
            if(error.message.includes('user-not-found')){
                systemErrorMessage = 'Usuário não encontrado.';
            }else if(error.message.includes('wrong-password')) {
                systemErrorMessage = 'Senha incorreta';
            } else { 
                systemErrorMessage = 'Ocorreu um erro, por favor tente novamente mais tarde.';

            }

            setError(systemErrorMessage);

        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, [])

    return {
        auth,
        createUser,
        loading,
        error,
        logout,
        login,
    }
}