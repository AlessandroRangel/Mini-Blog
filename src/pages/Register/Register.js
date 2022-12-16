import styles from './Register.module.css'
import { useState, useEffect } from 'react';
import { useAuthentication } from '../../hooks/useAuthentication';
const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { createUser, error: authError, loading  } = useAuthentication();

  const hundleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const user ={
      displayName,
      email,
      password
    }
    if(password !== confirmPassword) {
      setError('As senhas precisam ser iguais');
      return;
    }

    const res = await createUser(user)
    console.log(res)
  }
  useEffect(() => {
    if(authError){
      setError(authError);
    }
  }, [authError])
  return (
    <div className={styles.register}>
        <h2>Cadastre-se para postar</h2>
        <p>Crie seu usuário e compartilhe suas histórias</p>
        <form onSubmit={hundleSubmit}>
          <label>
            <span>Nome:</span>
            <input 
              type="text" 
              name='displayName' 
              required 
              placeholder='Nome do Usuário' 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
             />
          </label>
          <label>
            <span>E-mail:</span>
            <input 
              type="email" 
              name='email' 
              required 
              placeholder='E-mail do Usuário' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span>Senha:</span>
            <input 
              type="password" 
              name='password' 
              required
              placeholder='Insira sua senha' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            <span>Confirmar Senha:</span>
            <input 
              type="password"
              name='confirmPassword' 
              required
              placeholder='Confirme sua senha' 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          {!loading && <button className='btn' type='submit'>Cadastrar</button>}
          {loading && <button className='btn' type='submit'disabled>Aguarde...</button>}
          {error && <p className='error'>{error}</p>}
        </form>
    </div>
  )
}

export default Register