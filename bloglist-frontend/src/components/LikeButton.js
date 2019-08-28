import React from 'react'
import PropTypes from 'prop-types'

const LikeButton = ({ handleLike, blog }) => {

  LikeButton.propTypes = {
    handleLike: PropTypes.func.isRequired,
    blog: PropTypes.object.isRequired
  }

  return (
    <button onClick={() => handleLike(blog)}>like</button>
  )
}
export default LikeButton