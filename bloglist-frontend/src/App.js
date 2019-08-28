import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect( () => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect( () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logOutButton = () => {

    const logOut = () => {
      window.localStorage.clear()
      setUser(null)
      console.log(user)
    }

    return(
      <button type="submit" onClick={logOut}>logout</button>
    )
  }

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
        likes: -100
      }
      const newBlog = await blogService.create(blogObject)
      setErrorMessage(`a new blog ${newBlog.title} ${newBlog.author} was added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.concat(newBlog))
    } catch(exception) {
      setErrorMessage('blog was not added')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // huom. put puuttuu omasta backendista, tykkääminen aiheuttaa aina virheen
  const handleLike = async (blog) => {
    try {
      const likes = blog.likes + 1

      const blogObject = {
        user: blog.user,
        likes: { likes },
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      console.log(blog)

      const newBlog = await blogService.update(blog.id, blogObject)
      setErrorMessage(`blog ${newBlog.title} ${newBlog.author} was liked`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.concat(newBlog))
    } catch(exception) {
      setErrorMessage('error, blog was not liked')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    try {
      const whatDo = window.confirm(`remove blog ${blog.title} by ${blog.author}`)
      if(whatDo) {
        await blogService.remove(blog.id)
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
      } else {
        return
      }
    } catch(exception) {
      setErrorMessage('error, blog was not deleted')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => {

    return (
      <div>
        <div>
          <h2>Create new</h2>
          <form onSubmit={addBlog}>
            <div>
            title:
              <input
                type="text"
                value={newTitle}
                name="Title"
                onChange={({ target }) => setNewTitle(target.value)}
              />
            </div>
            <div>
            author:
              <input
                type="text"
                value={newAuthor}
                name="Author"
                onChange={({ target }) => setNewAuthor(target.value)}
              />
            </div>
            <div>
            url:
              <input
                type="text"
                value={newUrl}
                name="Url"
                onChange={({ target }) => setNewUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      </div>
    )
  }

  const blogFormRef = React.createRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage}/>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2>Blogs</h2>
        <Notification message={errorMessage}/>
        {`${user.name} logged in`}
        {logOutButton()}
        <h3></h3>
      </div>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          {blogForm()}
        </Togglable>
        <h2></h2>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} user={user}/>
          )}
      </div>
    </div>
  )
}

export default App
