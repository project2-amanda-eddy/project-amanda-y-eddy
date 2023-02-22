window.onload = () => {
    const likeBtns = document.querySelectorAll('.like-btn')
  
    likeBtns.forEach(likeBtn => {
      const commentId = likeBtn.value;
  
      const iconNode = likeBtn.querySelector('.bi')
      const likeCount = likeBtn.querySelector('span')
  
      likeBtn.onclick = () => {
        axios.post(`/comments/${commentId}/like`)
          .then((response) => {
            if (response.status === 201) {
              iconNode.classList.remove('bi-heart');
              iconNode.classList.add('bi-heart-fill');
              likeCount.textContent = Number(likeCount.textContent) + 1
            } else if (response.status === 204) {
              iconNode.classList.add('bi-heart');
              iconNode.classList.remove('bi-heart-fill');
              likeCount.textContent = Number(likeCount.textContent) - 1
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    })
  }