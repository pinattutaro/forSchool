console.log("this is script.js");
console.log(document.body);
let state = false;
const observer = new MutationObserver(() => {
    console.log('dom is changed');
    const bookmarkMenu = document.querySelector('.gtm-user-menu-bookmark');
    if(!bookmarkMenu) {
        state = false;
        return;
    }
    if(state) return;
    state = true;
    classes = (bookmarkMenu.className.split(/\s/));
    classes.pop();
    /*console.log(bookmarkMenu.nextElementSibling);*/
    const li = bookmarkMenu.parentElement.cloneNode();
    const a = bookmarkMenu.cloneNode();
    a.id = "searchingTag";
    a.className = classes.join(' ');
    a.textContent = "ブックマーク検索";
    a.href = "https://www.pixiv.net/users/81925394/bookmarks/artworks/customSearch";
    li.appendChild(a);
    bookmarkMenu.parentElement.after(li);
});

// URLが変更された場合に監視する
observer.observe(document.body, { childList: true, subtree: true });