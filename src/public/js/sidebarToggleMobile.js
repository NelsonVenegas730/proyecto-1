const toggleSidebarBtnOpen = document.querySelector('.sidebar-toggle-open')
const sidebar = document.querySelector('.sidebar')
const toggleSidebarBtnClose = document.querySelector('.sidebar-toggle-close')

toggleSidebarBtnOpen.addEventListener('click', () => {
  sidebar.classList.toggle('open')
})

toggleSidebarBtnClose.addEventListener('click', () => {
  sidebar.classList.remove('open')
})