import { handleToggleButton } from "./toggleSideBar.js"

const toggleButtons = document.querySelectorAll('.select-button-js')

toggleButtons.forEach((button) =>{
    button.addEventListener('click', () =>{
        const pageId = button.dataset.pageId
        console.log(pageId)
        showSelectedPage(pageId)
    })
})
function showSelectedPage(pageId){
    const allPages = document.querySelectorAll('.page')
    allPages.forEach((page) =>{
        page.classList.add('hidden')
    })

    document.getElementById(pageId).classList.remove('hidden')
}
handleToggleButton()