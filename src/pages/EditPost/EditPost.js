import styles from './EditPost.module.css';

import { useEffect, useState } from 'react';
import { useAuthValue } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';
import { useFetchDocument } from '../../hooks/useFetchDocument';

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument('posts', id);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  useEffect(() => {
    if (post) {
      setBody(post.body);
      setImage(post.image);
      setTitle(post.title);

      const textTags = post.tagsArray.join(', ');
      setTags(textTags);
    }
  }, [post])

  const { user } = useAuthValue();
  const { updateDocument, response } = useUpdateDocument('posts');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    //validate url image
    try {
      new URL(image);
    } catch (error) {
      setFormError('A imagem precisa ser uma URL.');
    }
    //create array of tags
    const tagsArray = tags.split(',').map((tag) => tag.trim().toLocaleLowerCase());

    //check all values
    if (!title && !image && !tags && !body) setFormError('Por favor preencha todos os campos');
    if (formError) return;
    const data = {
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName
    }
    updateDocument(id, data);

    //redirect to home page
    navigate('/dashboard');

    //reset inputs
    setTitle('');
    setImage('');
    setBody('');
    setTags('');
  }
  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>Editando post: {post.title}</h2>
          <p>Altere os dados do post com desejar</p>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Titulo:</span>
              <input
                type="text"
                name='title'
                required
                placeholder='Pense em um bom titulo...'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </label>
            <label>
              <span>URL da imagem:</span>
              <input
                type="text"
                name='image'
                required
                placeholder='Insira uma imagem que representa o seu post'
                onChange={(e) => setImage(e.target.value)}
                value={image}
              />
            </label>
            <p className={styles.preview_title}>Preview da imagem Atual: </p>
            <img className={styles.image_preview} src={post.image} alt={post.title} />
            <label>
              <span>Conteúdo:</span>
              <textarea
                name="body"
                required
                placeholder='Insira o conteúdo do post'
                onChange={(e) => setBody(e.target.value)}
                value={body}
              ></textarea>
            </label>
            <label>
              <span>Tags:</span>
              <input
                type="text"
                name='tags'
                required
                placeholder='Insira as tags separadas por virgula.'
                onChange={(e) => setTags(e.target.value)}
                value={tags}
              />
            </label>
            {!response.loading && <button className='btn' type='submit'>Cadastrar</button>}
            {response.loading && <button className='btn' type='submit' disabled>Aguarde...</button>}
            {response.error && <p className='error'>{response.error}</p>}
            {formError && <p className='error'>{formError}</p>}
          </form>
        </>
      )}
    </div>
  )
}

export default EditPost