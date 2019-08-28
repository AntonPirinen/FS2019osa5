import React from 'react'
import PropTypes from 'prop-types'

const DeleteButton = ({ handleDelete, blog }) => {

  DeleteButton.propTypes = {
    handleDelete: PropTypes.func.isRequired,
    blog: PropTypes.object.isRequired
  }

  return (
    <button onClick={() => handleDelete(blog)}>delete</button>
  )
}
export default DeleteButton