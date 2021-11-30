const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')

app.get('/top-posts', async (req, res) => {
  const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
  const { data: comments } = await axios.get('https://jsonplaceholder.typicode.com/comments')

  let postWithCommentCount = []

  for (const post of posts) {
    let newPostObj = {
      post_id: post.id,
      post_title: post.title,
      post_body: post.body,
      total_number_of_comments: 0
    }

    for (const comment of comments) {
      if (comment.postId === newPostObj.post_id) {
        newPostObj.total_number_of_comments += 1
      }
    }

    postWithCommentCount = [...postWithCommentCount, newPostObj]
  }

  postWithCommentCount.sort((a, b) => {
    return a.total_number_of_comments < b.total_number_of_comments ? 1 : -1
  })

  res.json(postWithCommentCount)
})

app.get('/comments', async (req, res) => {

  const { data: comments } = await axios.get('https://jsonplaceholder.typicode.com/comments')

  let filteredComments = []
  for (let comment of comments) {

    const keys = Object.keys(comment)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (req.query.hasOwnProperty(key) && comment[key] == req.query[key]) {
        filteredComments = [...filteredComments, comment]

        break
      }
    }
  }

  res.json(filteredComments)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})