import React, { useState } from 'react'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

const Blog = ({ blog, handleLike, handleDelete, user }) => {

  const [showAll, setShowAll] = useState(false)
  const [loggedIn, setLoggedIn] =useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleClick = () => {
    if(!showAll) {
      setShowAll(true)
    } else {
      setShowAll(false)
    }

    const creator = blog.user.username
    const loggedInUser = user.username

    console.log(creator)
    console.log(loggedInUser)

    if(creator === loggedInUser) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }

  const blogAll = () => {
    return (
      <div>
        <div>{blog.title} {blog.author}</div>
        <div>{blog.url}</div>
        <div>{blog.likes}</div>
        <div>added by {blog.user.name}</div>
        <LikeButton handleLike={handleLike} blog={blog}/>
        {loggedIn ? <DeleteButton handleDelete={handleDelete} blog={blog}/> : ''}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div onClick={() => handleClick()}>
        {showAll ? blogAll() : `${blog.title} ${blog.author}` }
      </div>
    </div>
  )
}

export default Blog