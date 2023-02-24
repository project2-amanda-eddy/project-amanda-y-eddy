window.onload = () => {
    const likeBtns = document.querySelectorAll('.like-btn')
  
    likeBtns.forEach(likeBtn => {
      const commentId = likeBtn.value;
  
      const iconNode = likeBtn.querySelector('.bx')
      const likeCount = likeBtn.querySelector('span')
  
      likeBtn.onclick = () => {
        axios.post(`/comments/${commentId}/like`)
          .then((response) => {
            if (response.status === 201) {
              iconNode.classList.remove('bx-heart');
              iconNode.classList.add('bxs-heart');
              likeCount.textContent = Number(likeCount.textContent) + 1
            } else if (response.status === 204) {
              iconNode.classList.add('bx-heart');
              iconNode.classList.remove('bxs-heart');
              likeCount.textContent = Number(likeCount.textContent) - 1
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    })
  }