import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';

//hooks
import { useAuthValue } from '../../context/AuthContext';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';

const Dashboard = () => {
  const { user } = useAuthValue();
  const uid = user.uid

  const { document: posts, } = useFetchDocuments('posts', null, uid);
  const { deleteDocument } = useDeleteDocument('posts');


  return (
    <div className={styles.dashboard}>
      <h2>Dashboard</h2>
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to='/post/create' className='btn'>Criar Primeiro Post</Link>
        </div>
      ) : (
        <>
          <div className={styles.post_header}>
            <span>Titulo</span>
            <span>Ações</span>
          </div>
          {posts && posts.map((post) => <div key={post.id} className={styles.post_row}>
            <p>{post.title}</p>
            <div>
              <Link to={`/post/${post.id}`} className='btn btn-outline'>Ver</Link>
              <Link to={`/post/edit/${post.id}`} className='btn btn-outline'>Editar</Link>
              <button onClick={() => deleteDocument(post.id)} className='btn btn-outline btn-danger'>Deletar</button>
            </div>

          </div>)}
        </>
      )}
    </div>
  )
}

export default Dashboard